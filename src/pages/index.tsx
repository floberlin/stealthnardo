import { Box, Button, Center, Flex, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { useEffect, useState } from 'react'
import { SITE_DESCRIPTION } from 'utils/config'
import { LocalStorageKey } from 'utils/localstorage'
import { utf8ToHex } from 'utils/web3'
import { useAccount, useSignMessage } from 'wagmi'

export default function Home() {
  const [stealthPin, setStealthPin] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [ethAmount, setEthAmount] = useState('')

  const { address } = useAccount()
  const { data, isError, isLoading, isSuccess, signMessageAsync } = useSignMessage()

  useEffect(() => {
    const stealthPin = localStorage.getItem(LocalStorageKey.StealthPin)
    if (stealthPin) setStealthPin(stealthPin)
  }, [])

  async function onUsePin() {
    if (!pinInput || !address) return

    const hex = '0x' + utf8ToHex(pinInput).slice(2)
    const signedTx = await signMessageAsync({ message: hex })

    console.log('utf8ToHex(pinInput)', utf8ToHex(pinInput))
    console.log('signedTx', signedTx)

    localStorage.setItem(LocalStorageKey.StealthPin, pinInput)
    setStealthPin(pinInput)
  }

  // const prevAddress = useRef(address)
  // useEffect(() => {
  //   if (prevAddress.current && !address) {
  //     return onResetPin()
  //   }

  //   prevAddress.current = address
  // }, [address])

  function onResetPin() {
    localStorage.removeItem(LocalStorageKey.StealthPin)
    setStealthPin('')
    setPinInput('')
  }

  function onAnonEth() {
    if (!ethAmount) return

    console.log('NOT IMPLEMENTED')
  }

  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">{SITE_DESCRIPTION}</HeadingComponent>

        {!address && (
          <Box mx="auto" width={'50vw'} mt={8}>
            <Center>Please log in with your wallet 🪪</Center>
          </Box>
        )}

        {address && !stealthPin && (
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

        {address && stealthPin && (
          <Box mx="auto" width={'50vw'} mt={8}>
            <InputGroup>
              <Input type="number" placeholder="Eth Amount" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
              <InputRightAddon>ETH</InputRightAddon>
            </InputGroup>

            <Flex justifyContent={'space-between'} mt={4}>
              <Button colorScheme="blue" onClick={onAnonEth}>
                Anonymize Eth
              </Button>
              <Button colorScheme="gray" onClick={onResetPin}>
                Reset Pin
              </Button>
            </Flex>
          </Box>
        )}

        {/* <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to bootstrap development.
        </Text> */}
      </main>
    </>
  )
}
