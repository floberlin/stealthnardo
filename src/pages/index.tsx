import { Box, Button, Center, Flex, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { SITE_DESCRIPTION } from 'utils/config'
import { LocalStorageKey } from 'utils/localstorage'
import { generateStealthMetaAddress } from 'utils/stealth/generateStealthAddress'
import padToOneByte from 'utils/stealth/padToOneByte'
import { utf8ToHex } from 'utils/stealth/utf8ToHex'
import { useAccount, useContractWrite, useSignMessage, useWaitForTransaction, useWalletClient } from 'wagmi'
import stealthRegistryArtifact from '../../contracts/out/StealthnardoRegistry.sol/StealthRegistry.json'
import { stealthRegistry } from '../utils/address'
import { stealthHandlerContract } from 'utils/contracts'

export default function Home() {
  const [stealthPin, setStealthPin] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [ethAmount, setEthAmount] = useState('')
  const [stealthMetaInfo, setStealthMetaInfo] = useState('')

  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { signMessageAsync } = useSignMessage()

  useEffect(() => {
    const stealthPin = localStorage.getItem(LocalStorageKey.StealthPin)
    if (stealthPin) setStealthPin(stealthPin)

    const stealthInfo = localStorage.getItem(LocalStorageKey.StealthMetaInfoAddress)
    if (stealthInfo) setStealthMetaInfo(JSON.parse(stealthInfo))
  }, [])

  const { data, write } = useContractWrite({
    address: stealthRegistry,
    abi: stealthRegistryArtifact.abi,
    functionName: 'registerKey',
  })
  if (data?.hash) console.log(data.hash)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  async function onUsePin() {
    if (!pinInput || !address || !walletClient || !write) return

    try {
      const hex = '0x' + utf8ToHex(pinInput).slice(2)
      const signedTx = await signMessageAsync({ message: hex })

      console.log('utf8ToHex(pinInput)', utf8ToHex(pinInput))
      console.log('signedTx', signedTx)

      const stealthInfo = generateStealthMetaAddress(signedTx)

      write({
        args: [stealthInfo.spendingPublicKey, stealthInfo.viewingPublicKey],
      })

      localStorage.setItem(LocalStorageKey.StealthPin, pinInput)
      localStorage.setItem(LocalStorageKey.StealthMetaInfoAddress, JSON.stringify(stealthInfo))

      setStealthPin(pinInput)
      setStealthMetaInfo(stealthMetaInfo)
    } catch (err: any) {
      console.error(`Error onUsePin: ${err.message}`)
    }
  }

  function onResetPin() {
    localStorage.removeItem(LocalStorageKey.StealthPin)
    localStorage.removeItem(LocalStorageKey.StealthMetaInfoAddress)
    setStealthPin('')
    setPinInput('')
  }

  async function onSendEth() {
    if (!ethAmount) return

    const stealthMetaAddress = localStorage.getItem(LocalStorageKey.StealthMetaInfoAddress)
    if (!stealthMetaAddress) return

    try {
      const stealthAddressInfo = generateStealthInfo(JSON.parse(stealthMetaAddress).stealthMetaAddress) as unknown as {
        stealthAddress: string
        ephemeralPublicKey: string
        ViewTag: string
        HashedSecret: string
      }
      console.log(stealthAddressInfo)

      const sta = stealthAddressInfo['stealthAddress']
      const ephk = stealthAddressInfo['ephemeralPublicKey']
      let vt = stealthAddressInfo['ViewTag']
      const hs = stealthAddressInfo['HashedSecret']

      vt = padToOneByte(vt)

      const inputAmountWei = ethers.utils.parseEther(ethAmount)

      await stealthHandlerContract.transferAndAnnounce(sta, ephk, vt, { value: inputAmountWei }).encodeABI()
    } catch (error) {
      console.log(error)
    }
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
        {address && (
          <Box mx="auto" width={'50vw'} mt={4}>
            <Box mt={8}>
              <Text>Receiver actions</Text>
            </Box>

            {!stealthPin && (
              <Box>
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
                <Button colorScheme="gray" onClick={onResetPin}>
                  Reset Pin
                </Button>
                <Box mt={8}>
                  <Text>Sender actions</Text>
                </Box>

                <InputGroup mt={8}>
                  <Input type="number" placeholder="Eth Amount" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
                  <InputRightAddon>ETH</InputRightAddon>
                </InputGroup>
                <Flex justifyContent={'space-between'} mt={4}>
                  <Button colorScheme="blue" onClick={onSendEth}>
                    Anonymize Eth
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        )}

        {/* <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to bootstrap development.
        </Text> */}
      </main>
    </>
  )
}
function generateStealthInfo(inputStealthMetaAddress: any) {
  throw new Error('Function not implemented.')
}
