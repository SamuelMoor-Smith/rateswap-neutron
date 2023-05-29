import { Box } from '@chakra-ui/react';
import { getBlockchainHeight } from '../api/query-fy-balance';
import { WalletSection } from '../components';

export default function Home() {

  getBlockchainHeight()

  return (
    <Box mx="auto" w="full" maxW={56} py={16}>
      <WalletSection />
    </Box>
  );
}
