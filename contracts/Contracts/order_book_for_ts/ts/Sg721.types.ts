/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.30.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export interface InstantiateMsg {
  fyusdc_contract: string;
  usdc_contract: string;
}
export type ExecuteMsg = {
  create: CreateMsg;
} | {
  top_up: {
    id: string;
  };
} | {
  set_recipient: {
    id: string;
    recipient: string;
  };
} | {
  approve: {
    id: string;
  };
} | {
  refund: {
    id: string;
  };
} | {
  receive: Cw20ReceiveMsg;
} | {
  cancel_bid: {
    order_id: string;
    price: Decimal;
  };
} | {
  cancel_ask: {
    order_id: string;
    price: Decimal;
  };
} | {
  update_bid_order: {
    id: string;
    new_quantity: Uint128;
  };
} | {
  update_ask_order: {
    id: string;
    new_quantity: Uint128;
  };
};
export type Uint128 = string;
export type Binary = string;
export type Decimal = string;
export interface CreateMsg {
  arbiter: string;
  cw20_whitelist?: string[] | null;
  description: string;
  end_height?: number | null;
  end_time?: number | null;
  id: string;
  recipient?: string | null;
  title: string;
}
export interface Cw20ReceiveMsg {
  amount: Uint128;
  msg: Binary;
  sender: string;
}
export type QueryMsg = {
  list: {};
} | {
  details: {
    id: string;
  };
} | {
  get_orderbook: {};
} | {
  get_user_orders: {
    user: Addr;
  };
} | {
  get_state: {};
};
export type Addr = string;
export interface DetailsResponse {
  arbiter: string;
  cw20_balance: Cw20Coin[];
  cw20_whitelist: string[];
  description: string;
  end_height?: number | null;
  end_time?: number | null;
  id: string;
  native_balance: Coin[];
  recipient?: string | null;
  source: string;
  title: string;
}
export interface Cw20Coin {
  address: string;
  amount: Uint128;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export interface OrderbookResponse {
  order_bucket: OrderBucket[];
}
export interface OrderBucket {
  asks: Order[];
  bids: Order[];
  price: string;
}
export interface Order {
  Type: string;
  id: string;
  orderer: Addr;
  owner: Addr;
  price: Decimal;
  quantity: Uint128;
}
export interface StateResponse {
  State: State[];
}
export interface State {
  fyusdc_contract: Addr;
  max_order_id: number;
  usdc_contract: Addr;
}
export interface UserOrdersResponse {
  orders: Order[];
}
export interface ListResponse {
  escrows: string[];
}