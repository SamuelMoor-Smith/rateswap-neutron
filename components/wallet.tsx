import { useManager } from '@cosmos-kit/react';
import { useEffect, useMemo, useState } from 'react';
import {
  ChainOption,
  ChooseChain,
  handleSelectChainDropdown,
  ConnectWalletButton,
} from '.';
import { ChainName } from '@cosmos-kit/core';
import { WalletCardSection } from './card';
import { Box } from '@chakra-ui/react';

export const WalletSection = () => {
  const [chainName, setChainName] = useState<ChainName | undefined>(
    'osmosis'
  );
  const { chainRecords, getChainLogo } = useManager();

  const chainOptions = useMemo(
    () =>
      chainRecords.map((chainRecord) => {
        return {
          chainName: chainRecord?.name,
          label: chainRecord?.chain.pretty_name,
          value: chainRecord?.name,
          icon: getChainLogo(chainRecord.name),
        };
      }),
    [chainRecords, getChainLogo]
  );

  useEffect(() => {
    setChainName(window.localStorage.getItem('selected-chain') || 'cosmoshub');
  }, []);

  const onChainChange: handleSelectChainDropdown = async (
    selectedValue: ChainOption | null
  ) => {
    setChainName(selectedValue?.chainName);
    if (selectedValue?.chainName) {
      window?.localStorage.setItem('selected-chain', selectedValue?.chainName);
    } else {
      window?.localStorage.removeItem('selected-chain');
    }
  };

  const chooseChain = (
    <ChooseChain
      chainName={chainName}
      chainInfos={chainOptions}
      onChange={onChainChange}
    />
  );

  return chainName ? (
    <WalletCardSection chainName={chainName} />
  ) : (
    <ConnectWalletButton buttonText={'Connect Wallet'} isDisabled />
  );
};
