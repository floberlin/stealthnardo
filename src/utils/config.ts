import { ThemingProps } from '@chakra-ui/react'
import { mainnet, sepolia, polygon, optimism, arbitrum } from '@wagmi/chains'
import { Chain } from 'viem'

export const SITE_NAME = 'stealthsend'
export const SITE_DESCRIPTION = 'Stealthanize your Eth!'
export const SITE_FOOTER = 'Made for EthDam by'
export const SITE_URL = 'https://stealthsend.vercel.app'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'wslyvh'
export const SOCIAL_GITHUB = 'wslyvh/nexth'

export const ETH_CHAINS = [mainnet, sepolia, polygon, optimism, arbitrum]

export const SCROLL_CHAIN: Chain = {
  id: 534353,
  name: 'Scroll Alpha Testnet',
  network: 'scroll',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      // http: ['https://blockscout.scroll.io/api/eth-rpc'],
      http: ['https://alpha-rpc.scroll.io/l2'],
    },
    public: {
      http: ['https://alpha-rpc.scroll.io/l2'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.scroll.io',
    },
  },
  // testnet: true,
}

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
