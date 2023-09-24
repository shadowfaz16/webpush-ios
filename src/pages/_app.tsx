import "@/styles/globals.css"
import type { AppProps, AppType } from "next/app"
import { Analytics } from "@vercel/analytics/react"
import { MagicBellProvider } from "@magicbell/react-headless"
import { SubscriptionManager } from "@/services/subscriptionManager"
import { DeviceInfoProvider } from "@/hooks/useDeviceInfo"

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon, scrollSepolia, sepolia } from 'wagmi/chains'

import { createPublicClient, http } from 'viem'
import { ChakraProvider } from "@chakra-ui/react"
import { theme } from "../styles/theme";



const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
if (!projectId) {
  throw new Error("You need to provide NEXT_PUBLIC_PROJECT_ID env variable");
}

const chains = [arbitrum, mainnet, polygon, scrollSepolia, sepolia]

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

const MyApp: AppType = ({ Component, pageProps }: ComponentWithPageLayout) => {
  return (
    <>
      <MagicBellProvider
        apiKey={process.env.NEXT_PUBLIC_MAGICBELL_API_KEY}
        userExternalId={SubscriptionManager.getOrSetUserId()}
      >
        <ChakraProvider theme={theme}>
          <WagmiConfig config={wagmiConfig}>
            <DeviceInfoProvider>
              {Component.PageLayout ? (
                <Component.PageLayout>
                  <Component {...pageProps} />
                </Component.PageLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </DeviceInfoProvider>
          </WagmiConfig>
        </ChakraProvider>
      </MagicBellProvider>
      <Analytics />

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} themeVariables={{
        '--w3m-font-family': 'Roboto, sans-serif',
        '--w3m-accent-color': '#F5841F'
      }} />
    </>
  )
}

export default MyApp