import Repay from '../components/pages/repay';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME } from './_app';
import { WalletStatus } from '@cosmos-kit/core';
import { Box } from '@chakra-ui/react';
import { WalletSection } from '../components';

export default function RepayPage() {

  const { status } = useChain(CHAIN_NAME); 

  if (status == WalletStatus.Connected) {
    return (
      <Repay />
    );
  } else {
    return (
      <Box mx="auto" w="full" maxW={56} py={16}>
        <WalletSection />
      </Box>
    );
  }
}