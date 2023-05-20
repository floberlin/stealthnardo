import { Box, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import { SITE_DESCRIPTION } from 'utils/config'
import { Input } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LocalStorageKey } from 'utils/localstorage'
import { Button, ButtonGroup } from '@chakra-ui/react'

export default function Home() {
  const [stealthPin, setStealthPin] = useState('')
  const [pinInput, setPinInput] = useState('')

  useEffect(() => {
    const stealthPin = localStorage.getItem(LocalStorageKey.StealthPin)
    if (stealthPin) setStealthPin(stealthPin)
  }, [])

  function onUsePin() {
    if (!pinInput) return

    localStorage.setItem(LocalStorageKey.StealthPin, pinInput)
    setStealthPin(pinInput)
  }

  function onResetPin() {
    localStorage.removeItem(LocalStorageKey.StealthPin)
    setStealthPin('')
    setPinInput('')
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">{SITE_DESCRIPTION}</HeadingComponent>

        {!stealthPin && (
          <Box mx="auto" width={'50vw'} mt={8}>
            <Text>No setup found. Start with a pin but pls don&apos;t forget it 👀</Text>
            <InputGroup mt={4}>
              <Input type="number" placeholder="Enter Pin" value={pinInput} onChange={(e) => setPinInput(e.target.value)} />
              <InputRightAddon>#</InputRightAddon>
            </InputGroup>
            <Button colorScheme="blue" mt={4} onClick={onUsePin}>
              Use Pin
            </Button>
          </Box>
        )}

        {stealthPin && (
          <Box mx="auto" width={'50vw'} mt={8}>
            <InputGroup>
              <Input type="number" placeholder="Send Eth" />
              <InputRightAddon>ETH</InputRightAddon>
            </InputGroup>
            <Button colorScheme="blue" mt={4} onClick={onResetPin}>
              Reset Pin
            </Button>
          </Box>
        )}

        {/* <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to bootstrap development.
        </Text> */}
      </main>
    </>
  )
}
