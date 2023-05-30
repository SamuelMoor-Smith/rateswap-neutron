#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    from_binary, to_binary, Addr, BankMsg, Binary, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, StdError, SubMsg, WasmMsg, Uint128, Decimal, CosmosMsg, Attribute
};

use cw2::set_contract_version;
use cw20::{Balance, Cw20Coin, Cw20CoinVerified, Cw20ExecuteMsg, Cw20ReceiveMsg, Expiration};
use std::collections::HashMap;

use crate::error::ContractError;
use crate::msg::{
    CreateMsg, DetailsResponse, ExecuteMsg, InstantiateMsg, ListResponse, QueryMsg, ReceiveMsg, CollateralResponse, LoanResponse, PricesResponse
};
use crate::state::{ all_escrow_ids, Escrow, GenericBalance, ESCROWS, State, STATE, COLLATERALS, LOANS, CONTRACT_USDC_BALANCE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:cw20-escrow";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = State {
        contract_owner: _info.sender,
        authorized_checker: _msg.authorized_checker,
        liquidation_deadline: _msg.liquidation_deadline,
        liquidator: _msg.liquidator,
        fyusdc_contract: _msg.fyusdc_contract,
        usdc_contract: _msg.usdc_contract,
        liquidation_threshold: _msg.liquidation_threshold,
        liquidation_penalty: _msg.liquidation_penalty,
        atom_contract: _msg.atom_contract,
    };

    STATE.save(deps.storage, &state)?;
    CONTRACT_USDC_BALANCE.save(deps.storage, &Uint128::zero())?;

    Ok(Response::new())
}


#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, StdError> {
    match msg {
        ExecuteMsg::Create(msg) => {
            execute_create(deps, msg, Balance::from(info.funds), &info.sender)
        }
        ExecuteMsg::SetRecipient { id, recipient } => {
            execute_set_recipient(deps, env, info, id, recipient)
        }
        ExecuteMsg::Approve { id } => execute_approve(deps, env, info, id),
        ExecuteMsg::TopUp { id } => execute_top_up(deps, id, Balance::from(info.funds)),
        ExecuteMsg::Refund { id } => execute_refund(deps, env, info, id),
        ExecuteMsg::Receive(msg) => execute_receive(deps, env, info, msg),
        ExecuteMsg::Withdraw { amount } => withdraw_collateral(deps, env, info, amount),
        ExecuteMsg::Borrow { amount } => borrow(deps, env, info, amount),
    }
}

pub fn execute_receive(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    wrapper: Cw20ReceiveMsg,
) -> Result<Response, StdError> {
    let state= STATE.load(deps.storage)?;
    let msg: ReceiveMsg = from_binary(&wrapper.msg)?;
    let balance = Balance::Cw20(Cw20CoinVerified {
        amount: wrapper.amount,
        address: info.sender.clone(),     
    });

    match &info.sender.clone() {
        sender if sender == state.fyusdc_contract || sender == state.usdc_contract || sender == state.atom_contract => (),
        _ => return Err(StdError::generic_err("Invalid sender")),
    }

    let api = deps.api;
    if info.sender == state.atom_contract {
        match msg {
            ReceiveMsg::Deposit { orderer, .. } => deposit_collateral(deps, env, info, orderer, wrapper.amount),
            _ => Err(StdError::generic_err("Invalid operation for atom contract")),
        }
    } else if info.sender == state.usdc_contract {
        match msg {
            ReceiveMsg::Repay { orderer, .. } => repay_loan(deps, env, info, orderer, wrapper.amount),
            _ => Err(StdError::generic_err("Invalid operation for USDC contract")),
        }
    } else if info.sender == state.fyusdc_contract {
        match msg {
            ReceiveMsg::Redeem { orderer, .. } => try_withdraw_usdc(deps, env, info, orderer, wrapper.amount),
            _ => Err(StdError::generic_err("Invalid operation for fyUSDC contract")),
        }
    } else {
        match msg {
            ReceiveMsg::Create(msg) => {
                execute_create(deps, msg, balance, &api.addr_validate(&wrapper.sender)?)
            }
            ReceiveMsg::TopUp { id } => execute_top_up(deps, id, balance),
            _ => Err(StdError::generic_err("Invalid operation")),
        }
    }
}



fn deposit_collateral(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    orderer: Addr,
    amount: Uint128,
) -> Result<Response, StdError> {
    // Load user's collateral from storage
    let mut collateral = COLLATERALS.load(deps.storage, &orderer)?;


    // Add the deposited amount to the user's collateral
    collateral += amount;

    // Save the updated collateral amount to storage
    COLLATERALS.save(deps.storage, &orderer, &collateral)?;


    // Return a successful response
    Ok(Response::new().add_attributes(vec![
        Attribute::new("action", "deposit_collateral"),
        Attribute::new("sender", orderer),
        Attribute::new("collateral_amount", amount),
    ]))
}


pub fn withdraw_collateral(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> Result<Response, StdError> {
    let state = STATE.load(deps.storage)?;
    let liquidation_threshold = state.liquidation_threshold;
    let mut collateral = COLLATERALS.load(deps.storage, &info.sender)?;

    // Query prices for USDC and ATOM
    let prices_response = query_prices(deps.as_ref())?;

    // Calculate the new collateral balance after withdrawal
    let collateral_usd = (collateral - amount) * prices_response.atom;

    // Retrieve the borrower's loan balance
    let loan = LOANS.load(deps.storage, &info.sender)?;
    let loan_usd = loan * prices_response.usdc;

    // Calculate the new collateralization ratio
    let new_collateralization_ratio = if loan == Uint128::zero() {
        Decimal::one()
    } else {
        Decimal::from_ratio(collateral_usd, loan_usd)
    };

    // Check if the new collateralization ratio is above the liquidation threshold
    if new_collateralization_ratio < liquidation_threshold {
        return Err(StdError::generic_err("Withdrawal would trigger liquidation"));
    }

    // Decrease collateral
    collateral -= amount;
    COLLATERALS.save(deps.storage, &info.sender, &collateral)?;

    // Create CW20 Transfer message
    let transfer_msg = Cw20ExecuteMsg::Transfer {
        recipient: info.sender.to_string(),
        amount,
    };

    let cosmos_msg = WasmMsg::Execute {
        contract_addr: state.atom_contract.to_string(), // Assume this is the ATOM CW20 contract address
        msg: to_binary(&transfer_msg)?,
        funds: vec![],
    };

    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_attributes(vec![
            Attribute::new("action", "withdraw_collateral"),
            Attribute::new("sender", info.sender),
            Attribute::new("collateral_amount", amount),
        ]))
}

pub fn borrow(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> Result<Response, StdError> {
    // Load user's collateral and loan from storage
    let mut collateral = COLLATERALS.load(deps.storage, &info.sender)?;
    let mut loan = LOANS.load(deps.storage, &info.sender)?;

    // Load the state
    let state = STATE.load(deps.storage)?;

    // Query prices for USDC and ATOM
    let prices_response = query_prices(deps.as_ref())?;

    // Convert loan balance and collateral balance to USD value
    let collateral_balance_usd = collateral * prices_response.atom;

    // Calculate the maximum amount the user can borrow
    let max_borrow = collateral_balance_usd * Uint128::new(50) / Uint128::new(100);

    // Check if the user can borrow the requested amount
    if loan + amount > max_borrow {
        return Err(StdError::generic_err("Insufficient collateral to borrow this amount"));
    }

    // Add the borrowed amount to the user's loan
    loan += amount;

    //Mint borrower amount number of fyUSDC * fyUSDC price, which we need to get from the order book
    // Mint the amount of fyUSDC tokens to the user
    let fyusdc_contract_address = state.fyusdc_contract.to_string();
    let cw20_msg = Cw20ExecuteMsg::Mint {
        recipient: info.sender.to_string(),
        amount,
    };
    let cosmos_msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: fyusdc_contract_address.to_string(),
        msg: to_binary(&cw20_msg)?,
        funds: vec![],
    });
    // Save the updated loan amount to storage
    LOANS.save(deps.storage, &info.sender, &loan)?;


    // Return a successful response
    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_attribute("action", "borrow"))
}


fn repay_loan(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    orderer: Addr,
    amount: Uint128,
) -> Result<Response, StdError> {
    // Load user's loan from storage
    let mut collateral = COLLATERALS.load(deps.storage, &orderer)?;
    let mut loan = LOANS.load(deps.storage, &orderer)?;
    let state = STATE.load(deps.storage)?;

    // Check if the user has a loan to repay
    if loan.is_zero() {
        return Err(StdError::generic_err("No outstanding loan to repay"));
    }

    // Subtract the repaid amount from the user's loan
    if amount >= loan {
        // If the repaid amount is greater or equal to the outstanding loan, set the loan to zero
        loan = Uint128::zero();
    } else {
        // Otherwise, subtract the repaid amount from the loan
        loan -= amount;
    }

     // Save the updated loan amount to storage
    LOANS.save(deps.storage, &info.sender, &loan)?;

    //Save the repaid amount in the contract's storage
    let contract_usdc_balance = CONTRACT_USDC_BALANCE.load(deps.storage)?;
    CONTRACT_USDC_BALANCE.save(deps.storage, &(contract_usdc_balance + amount))?;

    Ok(Response::new()
        .add_attribute("action", "repay_loan")
    )
}

fn try_withdraw_usdc(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    orderer: Addr,
    token_amount: Uint128,
) -> StdResult<Response> {
    // Verify if the current block time is past the liquidation deadline
    let state = STATE.load(deps.storage)?;

    match state.liquidation_deadline {
        Expiration::AtTime(liquidation_timestamp) if env.block.time < liquidation_timestamp => {
            return Err(StdError::generic_err("Withdrawal is not allowed before the liquidation deadline"));
        },
        _ => {},
    }


    // Check the contract's USDC balance to ensure it has enough tokens to cover the withdrawal
    let usdc_balance = CONTRACT_USDC_BALANCE.load(deps.storage)?;
    if usdc_balance < token_amount {
        return Err(StdError::generic_err("Not enough USDC tokens in the contract to cover the withdrawal"));
    }

    // Update the contract's USDC balance
    CONTRACT_USDC_BALANCE.save(deps.storage, &(usdc_balance - token_amount))?;


    // Send USDC tokens to the user
    let usdc_contract_address = state.usdc_contract.to_string();
    let cw20_msg = Cw20ExecuteMsg::Transfer {
        recipient: info.sender.to_string(),
        amount: token_amount,
    };
    let cosmos_msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: usdc_contract_address,
        msg: to_binary(&cw20_msg)?,
        funds: vec![],
    });

    // Burn the fyUSDC tokens
    let fyusdc_contract_address = state.fyusdc_contract.to_string();
    let cw20_burn_msg = Cw20ExecuteMsg::Burn {
        amount: token_amount,
    };
    let cosmos_burn_msg = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: fyusdc_contract_address,
        msg: to_binary(&cw20_burn_msg)?,
        funds: vec![],
    });

    Ok(Response::new()
        .add_message(cosmos_msg)
        .add_message(cosmos_burn_msg)
        .add_attribute("action", "withdraw_usdc"))
}





pub fn execute_create(
    deps: DepsMut,
    msg: CreateMsg,
    balance: Balance,
    sender: &Addr,
) -> Result<Response, StdError> {
    if balance.is_empty() {
        return Err(StdError::generic_err("Balance cannot be empty"));
    }

    let mut cw20_whitelist = msg.addr_whitelist(deps.api)?;

    let escrow_balance = match balance {
        Balance::Native(balance) => GenericBalance {
            native: balance.0,
            cw20: vec![],
        },
        Balance::Cw20(token) => {
            // make sure the token sent is on the whitelist by default
            if !cw20_whitelist.iter().any(|t| t == &token.address) {
                cw20_whitelist.push(token.address.clone())
            }
            GenericBalance {
                native: vec![],
                cw20: vec![token],
            }
        }
    };

    let recipient: Option<Addr> = msg
        .recipient
        .and_then(|addr| deps.api.addr_validate(&addr).ok());

    let escrow = Escrow {
        arbiter: deps.api.addr_validate(&msg.arbiter)?,
        recipient,
        source: sender.clone(),
        title: msg.title,
        description: msg.description,
        end_height: msg.end_height,
        end_time: msg.end_time,
        balance: escrow_balance,
        cw20_whitelist,
    };

    // try to store it, fail if the id was already in use
    ESCROWS.update(deps.storage, &msg.id, |existing| match existing {
        None => Ok(escrow),
        Some(_) => Err(StdError::generic_err("ID is already in use")),
    })?;

    let res = Response::new().add_attributes(vec![("action", "create"), ("id", msg.id.as_str())]);
    Ok(res)
}


pub fn execute_set_recipient(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    id: String,
    recipient: String,
) -> Result<Response, StdError> {
    let mut escrow = ESCROWS.load(deps.storage, &id)?;
    if info.sender != escrow.arbiter {
        return Err(StdError::generic_err("Unauthorized access"));
    }

    let recipient = deps.api.addr_validate(recipient.as_str())?;
    escrow.recipient = Some(recipient.clone());
    ESCROWS.save(deps.storage, &id, &escrow)?;

    Ok(Response::new().add_attributes(vec![
        ("action", "set_recipient"),
        ("id", id.as_str()),
        ("recipient", recipient.as_str()),
    ]))
}
pub fn execute_top_up(
    deps: DepsMut,
    id: String,
    balance: Balance,
) -> Result<Response, StdError> {
    if balance.is_empty() {
        return Err(StdError::generic_err("Balance cannot be empty"));
    }
    // this fails is no escrow there
    let mut escrow = ESCROWS.load(deps.storage, &id)?;

    if let Balance::Cw20(token) = &balance {
        // ensure the token is on the whitelist
        if !escrow.cw20_whitelist.iter().any(|t| t == &token.address) {
            return Err(StdError::generic_err("Token is not in the whitelist"));
        }
    };

    escrow.balance.add_tokens(balance);

    // and save
    ESCROWS.save(deps.storage, &id, &escrow)?;

    let res = Response::new().add_attributes(vec![("action", "top_up"), ("id", id.as_str())]);
    Ok(res)
}

pub fn execute_approve(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    id: String,
) -> Result<Response, StdError> {
    let escrow = ESCROWS.load(deps.storage, &id)?;

    if info.sender != escrow.arbiter {
        return Err(StdError::generic_err("Unauthorized access"));
    }

    if escrow.is_expired(&env) {
        return Err(StdError::generic_err("The escrow has expired"));
    }


    let recipient = escrow.recipient.ok_or_else(|| StdError::generic_err("Recipient not set"))?;

    // we delete the escrow
    ESCROWS.remove(deps.storage, &id);

    // send all tokens out
    let messages: Vec<SubMsg> = send_tokens(&recipient, &escrow.balance)?;

    Ok(Response::new()
        .add_attribute("action", "approve")
        .add_attribute("id", id)
        .add_attribute("to", recipient)
        .add_submessages(messages))
}

pub fn execute_refund(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    id: String,
) -> Result<Response, StdError> {
    let escrow = ESCROWS.load(deps.storage, &id)?;

    if !escrow.is_expired(&env) && info.sender != escrow.arbiter {
        return Err(StdError::generic_err("Unauthorized access"));
    }
    else {
        // we delete the escrow
        ESCROWS.remove(deps.storage, &id);

        // send all tokens out
        let messages = send_tokens(&escrow.source, &escrow.balance)?;

        Ok(Response::new()
            .add_attribute("action", "refund")
            .add_attribute("id", id)
            .add_attribute("to", escrow.source)
            .add_submessages(messages))
    }
}

fn send_tokens(to: &Addr, balance: &GenericBalance) -> StdResult<Vec<SubMsg>> {
    let native_balance = &balance.native;
    let mut msgs: Vec<SubMsg> = if native_balance.is_empty() {
        vec![]
    } else {
        vec![SubMsg::new(BankMsg::Send {
            to_address: to.into(),
            amount: native_balance.to_vec(),
        })]
    };

    let cw20_balance = &balance.cw20;
    let cw20_msgs: StdResult<Vec<_>> = cw20_balance
        .iter()
        .map(|c| {
            let msg = Cw20ExecuteMsg::Transfer {
                recipient: to.into(),
                amount: c.amount,
            };
            let exec = SubMsg::new(WasmMsg::Execute {
                contract_addr: c.address.to_string(),
                msg: to_binary(&msg)?,
                funds: vec![],
            });
            Ok(exec)
        })
        .collect();
    msgs.append(&mut cw20_msgs?);
    Ok(msgs)
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::List {} => to_binary(&query_list(deps)?),
        QueryMsg::Details { id } => to_binary(&query_details(deps, id)?),
        QueryMsg::GetCollateral { address } => to_binary(&query_collateral(deps, address)?),
        QueryMsg::GetLoan { address } => to_binary(&query_loan(deps, address)?),
        QueryMsg::GetPrices {} => to_binary(&query_prices(deps)?)
    }
}


fn query_collateral(deps: Deps, address: Addr) -> StdResult<CollateralResponse> {
    let balance = COLLATERALS.load(deps.storage, &address)?;
    Ok(CollateralResponse {
        address,
        balance,
    })
}

fn query_loan(deps: Deps, address: Addr) -> StdResult<LoanResponse> {
    let balance = LOANS.load(deps.storage, &address)?;
    Ok(LoanResponse {
        address,
        balance,
    })
}

pub fn query_prices(_deps: Deps) -> StdResult<PricesResponse> {
    // Hard-coded prices
    let prices = PricesResponse {
        atom: Decimal::one(),
        usdc: Decimal::one(),
    };

    Ok(prices)
}



fn query_details(deps: Deps, id: String) -> StdResult<DetailsResponse> {
    let escrow = ESCROWS.load(deps.storage, &id)?;

    let cw20_whitelist = escrow.human_whitelist();

    // transform tokens
    let native_balance = escrow.balance.native;

    let cw20_balance: StdResult<Vec<_>> = escrow
        .balance
        .cw20
        .into_iter()
        .map(|token| {
            Ok(Cw20Coin {
                address: token.address.into(),
                amount: token.amount,
            })
        })
        .collect();

    let recipient = escrow.recipient.map(|addr| addr.into_string());

    let details = DetailsResponse {
        id,
        arbiter: escrow.arbiter.into(),
        recipient,
        source: escrow.source.into(),
        title: escrow.title,
        description: escrow.description,
        end_height: escrow.end_height,
        end_time: escrow.end_time,
        native_balance,
        cw20_balance: cw20_balance?,
        cw20_whitelist,
    };
    Ok(details)
}

fn query_list(deps: Deps) -> StdResult<ListResponse> {
    Ok(ListResponse {
        escrows: all_escrow_ids(deps.storage)?,
    })
}




#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, Addr, CosmosMsg, Decimal, Uint128, WasmMsg};

    #[test]
    fn test_execute_receive() {
        let mut deps = mock_dependencies();

        // Initialize the state
        let usdc_contract = "usdc_contract".to_string();
        let fyusdc_contract = "fyusdc_contract".to_string();

        let state = State {
            fyusdc_contract: Addr::unchecked(fyusdc_contract.clone()),
            usdc_contract: Addr::unchecked(usdc_contract.clone()),
            max_order_id: 0,
        };

        STATE.save(&mut deps.storage, &state).unwrap();

        let env = mock_env();
        let info = mock_info(&fyusdc_contract, &coins(250, "usdc"));

        let msg = Cw20ReceiveMsg {
            sender: info.sender.clone().into_string(),
            amount: Uint128::new(250),
            msg: to_binary(&ReceiveMsg::CreateAsk { 
                quantity: Uint128::new(500), 
                price: Decimal::percent(50) 
            }).unwrap(),
        };

        // Execute the contract
        let _res = execute_receive(deps.as_mut(), env.clone(), info.clone(), msg.clone()).unwrap();
        
        // Let's check if the sender is being recognized correctly
        let updated_state = STATE.load(deps.as_ref().storage).unwrap();
        assert_eq!(updated_state.fyusdc_contract, info.sender);
        assert_eq!(updated_state.usdc_contract, Addr::unchecked(usdc_contract));

        // Now let's attempt to call `execute_receive` with a different sender
        let different_sender_info = mock_info("another_contract", &coins(250, "usdc"));
        let different_sender_msg = Cw20ReceiveMsg {
            sender: different_sender_info.sender.clone().into_string(),
            amount: Uint128::new(250),
            msg: to_binary(&ReceiveMsg::CreateAsk { 
                quantity: Uint128::new(500), 
                price: Decimal::percent(50) 
            }).unwrap(),
        };

        let different_sender_res = execute_receive(deps.as_mut(), env, different_sender_info, different_sender_msg);
        assert!(different_sender_res.is_err(), "Should fail due to invalid sender");
    }
}



