import {
    Box,
    Image,
    useColorMode,
  } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

import { ChooseChain } from './react';
import { ChainOption } from './types';
import { WalletStatus } from '@cosmos-kit/core';

import { useManager } from '@cosmos-kit/react';
import { useEffect, useMemo, useState } from 'react';
import {
  handleSelectChainDropdown, WalletSection,
} from '.';
import { ChainName } from '@cosmos-kit/core';

import { useChain } from "@cosmos-kit/react";
import {
  ConnectedShowAddress,
  CopyAddressBtn,
} from ".";
import { DesktopMenu, MobileMenu } from './menu-items';
import Link from 'next/link';

type SimpleLayoutType = {
  logo?: React.ReactNode;
  connectButton?: React.ReactNode;
  categorizedLinks?: CategorizedLinksType[];
  customLink?: Function;
  chainDropdown?: React.ReactNode;
  copyAddressButton?: React.ReactNode;
  isFullWidth?: boolean;
  children: React.ReactNode;
};
type CategoryComponentType = {
  label: string;
  href: string;
};
interface LinkListType extends CategoryComponentType {
  icon?: React.ReactNode;
  category: string;
}

type CategorizedLinksType = { category: string, links: LinkListType[] };
  
const SimpleLayout = ({
  logo,
  connectButton,
  categorizedLinks,
  customLink,
  chainDropdown,
  copyAddressButton,
  isFullWidth,
  children
}: SimpleLayoutType) => {
  const { toggleColorMode } = useColorMode();

    return (
      <Box w="full" h="full">
        <Box display={{ base: 'none', lg: 'block' }} w="full" h="full">
          <DesktopMenu
            logo={logo}
            connectButton={connectButton}
            categorizedLinks={categorizedLinks}
            customLink={customLink}
            chainDropdown={chainDropdown}
            copyAddressButton={copyAddressButton}
            toggleColorMode={toggleColorMode}
          >
            {children}
          </DesktopMenu>
        </Box>
        <Box display={{ base: 'block', lg: 'none' }} w="full" h="full">
          <MobileMenu
            isFullWidth={isFullWidth}
            logo={logo}
            connectButton={connectButton}
            categorizedLinks={categorizedLinks}
            customLink={customLink}
            chainDropdown={chainDropdown}
            copyAddressButton={copyAddressButton}
            toggleColorMode={toggleColorMode}
          >
            {children}
          </MobileMenu>
        </Box>
      </Box>
    );
  };

  type LayoutProps = {
    children: ReactNode;
  }

  export default function Layout ({ children } : LayoutProps) {

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

    const { status, address } =
        useChain(chainName ? chainName : 'osmosis');

    const addressBtn = (chainName && status === WalletStatus.Connected  ?
        (<CopyAddressBtn
        walletStatus={status}
        connected={<ConnectedShowAddress address={address} isLoading={false} />}
        />) :
        (<CopyAddressBtn 
        walletStatus={WalletStatus.Connected} 
        connected={<ConnectedShowAddress address={"Please Connect"} isLoading={true} />}
        />)
    );

    const logo = (
      <Link href="/">
        <a>
          <Box w={{ base: 10, lg: 20 }} h={{ base: 10, lg: 20 }} pt="3">
            <Image src="logo-removebg.png" />
          </Box>
        </a>
      </Link>
    );
    const linkItems = {
      'Borrower': [
        {
          label: '🏦 Deposit',
          href: '/deposit',
          category: 'Borrower'
        },
        {
          label: '🪙 Mint',
          href: '/mint',
          category: 'Borrower'
        },
        {
          label: '🫴 Repay',
          href: '/repay',
          category: 'Borrower'
        },
        {
          label: '🫳 Withdraw',
          href: '/withdraw',
          category: 'Borrower'
        }
      ],
      'Exchange': [
        {
          label: '📈 Exchange',
          href: '/exchange',
          category: 'Exchange'
        },
      ],
      'Lender': [
        {
          label: '💰 Redeem',
          href: '/redeem',
          category: 'Lender'
        }
      ]
    };
    
    const categorizedLinks: CategorizedLinksType[] = Object.entries(linkItems).map(([category, links]) => ({ category, links }));    
  
    return (
      <Box w="full" h="full" minH={typeof window !== 'undefined' ? window.innerHeight : 0}>
        <SimpleLayout
          logo={logo}
          connectButton={WalletSection()}
          categorizedLinks={categorizedLinks}
          chainDropdown={chooseChain}
          copyAddressButton={chainName ? (addressBtn) : (<CopyAddressBtn walletStatus={WalletStatus.Connected} connected={undefined} />)}
          isFullWidth={false}
        >
          {children}
        </SimpleLayout>
      </Box>
    );
  }