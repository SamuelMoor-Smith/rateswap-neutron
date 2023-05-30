import { useManager } from '@cosmos-kit/react';
import { useEffect, useMemo, useState } from 'react';
import {
  ChainOption,
  handleSelectChainDropdown,
  ConnectWalletButton,
} from '.';
import { ChainName } from '@cosmos-kit/core';
import { WalletCardSection } from './card';
import { Box } from '@chakra-ui/react';

const chainOption = {
  chainName: 'neutrontestnet',
  label: 'Neutron Testnet',
  value: 'neutrontestnet',
  icon: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron.svg'
} as ChainOption;

export const WalletSection = () => {
  const { chainRecords, getChainLogo } = useManager();

  const chainName = chainOption.chainName;

  return chainName ? (
    <WalletCardSection chainName={chainName} />
  ) : (
    <ConnectWalletButton buttonText={'Connect Wallet'} isDisabled />
  );
};
