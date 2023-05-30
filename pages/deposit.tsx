import { Deposit } from '../components/pages/deposit';
import { useChain } from '@cosmos-kit/react';
import { CHAIN_NAME } from './_app';
import { WalletStatus } from '@cosmos-kit/core';
import { Box } from '@chakra-ui/react';
import { WalletSection } from '../components';

export default function DepositPage() {

  const { status } = useChain(CHAIN_NAME); 

  if (status == WalletStatus.Connected) {
    return (
      <Deposit />
    );
  } else {
    return (
      <Box mx="auto" w="full" maxW={56} py={16}>
        <WalletSection />
      </Box>
    );
  }
}
