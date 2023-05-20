import { Box, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { SITE_DESCRIPTION } from 'utils/config'
import { Input } from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">{SITE_DESCRIPTION}</HeadingComponent>
        <Text>Quickly ship Web3 Apps ⚡</Text>

        <Box mx="auto" width={'50vw'}>
          <InputGroup>
            <Input type="number" placeholder="Send Eth" />
            <InputRightAddon>ETH</InputRightAddon>
          </InputGroup>
          {/* <Input placeholder="Send Eth" /> */}
        </Box>

        <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to bootstrap development.
        </Text>
      </main>
    </>
  )
}
