import { useState, useEffect } from 'react';
import { ChainBox } from './chain-dropdown';
import {
  ChooseChainInfo,
  ChainOption,
  handleSelectChainDropdown
} from '../types';

export function Chain({
  chainOption,
  // chainName,
  // chainInfos,
}: {
  chainOption: ChainOption,
  // chainName?: string;
  // chainInfos: ChooseChainInfo[];
}) {
  // console.log(chainInfos)
  // const selectedItem = chainInfos.filter((options) => options.chainName === "neutrontestnet")[0]
  // console.log(selectedItem)
  return (
    <ChainBox
      chainOption={chainOption}
    />
  );
}
