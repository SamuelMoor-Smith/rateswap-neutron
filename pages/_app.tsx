import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChainProvider } from '@cosmos-kit/react';
import { defaultTheme } from '../config';
import { ChakraProvider } from '@chakra-ui/react';
import { wallets } from '@cosmos-kit/keplr';
import { MainWalletBase, SignerOptions } from '@cosmos-kit/core';
import { chains, assets } from 'chain-registry';
import Layout from '../components/layout';
import { ChainBox } from '../components';

export const CHAIN_NAME = 'neutrontestnet';

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const signerOptions: SignerOptions = {
    // signingStargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={([...wallets] as unknown) as MainWalletBase[]}
        walletConnectOptions={{
          signClient: {
            projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
            relayUrl: 'wss://relay.walletconnect.org',
            metadata: {
              name: 'CosmosKit Template',
              description: 'CosmosKit dapp template',
              url: 'https://docs.cosmoskit.com/',
              icons: [],
            },
          },
        }}
        wrappedWithChakra={true}
        signerOptions={signerOptions}
      >
        <Layout>

          {/* <ChainBox chainOption={chainData} /> */}
          <Component {...pageProps} />
        </Layout>
      </ChainProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
