import { Stack } from "@chakra-ui/react";
import { LockTokens } from "./lock-tokens";
import { Swap } from "./swap";

export const Borrow = () => {
return (
  <Stack spacing={6} w="full" p={{ base: 4, sm: 6 }}>
    <Swap />
    <LockTokens />
  </Stack>
);
};