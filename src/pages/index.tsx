import { Box, Button, Center, Flex, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { LocalStorageKey } from 'utils/localstorage'
import { generateStealthMetaAddress } from 'utils/stealth/generateStealthAddress'
import padToOneByte from 'utils/stealth/padToOneByte'
import { utf8ToHex } from 'utils/stealth/utf8ToHex'
import { useAccount, useContractRead, useContractWrite, useSignMessage, useWaitForTransaction, useWalletClient } from 'wagmi'
import stealthRegistryArtifact from '../../contracts/out/StealthRegistry.sol/StealthRegistry.json'
import stealthHandlerArtifact from '../../contracts/out/StealthHandler.sol/StealthHandler.json'
import { stealthRegistry, stealthHandler } from '../utils/address'
import { stealthHandlerContract } from 'utils/contracts'
import { parseEther } from 'viem'

export default function Home() {
  const [stealthPin, setStealthPin] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [ethAmount, setEthAmount] = useState('')

  const [col, setCol] = useState('red')
  const [col2, setCol2] = useState('red')

  const [inputMetaAddr, setinputMetaAddr] = useState('')
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

  const { data: tranferData, write: tranferWrite } = useContractWrite({
    address: stealthHandler,
    abi: stealthHandlerArtifact.abi,
    functionName: 'transferAndAnnounce',
  })
  if (data?.hash) console.log(data.hash)
  const { isLoading: isLoad, isSuccess: isSuc } = useWaitForTransaction({
    hash: data?.hash,
  })

  const { data: ReadMapping } = useContractRead({
    address: stealthRegistry,
    abi: stealthRegistryArtifact.abi,
    functionName: 'checkRegistered',
    args: [inputMetaAddr],
    onSuccess(data) {
      data ? setCol('green') : setCol('red')
    },
  })

  const { data: ReadMapping2 } = useContractRead({
    address: stealthRegistry,
    abi: stealthRegistryArtifact.abi,
    functionName: 'checkRegistered',
    args: [address],
    onSuccess(data) {
      data ? setCol2('green') : setCol2('red')
    },
  })

  // const { data: tranferData, write: tranferWrite } = useContractRead({
  //   address: stealthHandler,
  //   abi: stealthHandlerArtifact.abi,
  //   functionName: 'transferAndAnnounce',
  // })
  // if (data?.hash) console.log(data.hash)
  // const { isLoading: isLoad, isSuccess: isSuc } = useWaitForTransaction({
  //   hash: data?.hash,
  // })

  async function onUsePin() {
    if (!pinInput || !address || !walletClient || !write) return

    try {
      const hex = '0x' + utf8ToHex(pinInput).slice(2)
      const signedTx = await signMessageAsync({ message: hex })

      console.log('utf8ToHex(pinInput)', utf8ToHex(pinInput))
      console.log('signedTx', signedTx)

      const stealthInfo = generateStealthMetaAddress(signedTx)

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

    // const stealthMetaAddress = localStorage.getItem(LocalStorageKey.StealthMetaInfoAddress)

    const stealthMetaAddress =
      '0x030618da230776840f0014c59a267a75c928e4c22f759957db57cbd14d4d425e3d035e56eef185930b19bfd885e21f7a9c595dc63a00f1b677a2723dc65117ccfb16'

    if (!stealthMetaAddress) return

    try {
      const stealthAddressInfo = generateStealthInfo(stealthMetaAddress) as unknown as {
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

      // tranferWrite({
      //   args: [sta, ephk, vt],
      //   value: parseEther(ethAmount as `${number}`),
      // })

      // const inputAmountWei = ethers.utils.parseEther(ethAmount)

      // await stealthHandlerContract.transferAndAnnounce(sta, ephk, vt, { value: inputAmountWei }).encodeABI()
    } catch (error) {
      console.log(error)
    }
  }

  console.log('ReadMapping', ReadMapping)

  return (
    <>
      <Head />

      <main>
        {/* <HeadingComponent as="h2">{SITE_DESCRIPTION}</HeadingComponent> */}
        {!address && (
          <Box mx="auto" width={'50vw'} mt={8}>
            <Center>Please log in with your wallet 🪪</Center>
          </Box>
        )}
        {address && (
          <Box mx="auto" width={'50vw'} mt={4}>
            <Box mt={8}>
              <h1>Receiver</h1>
            </Box>

            {stealthPin && (
              <p>
                Your stealth meta address is: <b>{stealthMetaInfo.stealthMetaAddress}</b>
              </p>
            )}

            {col2 === 'red' && (
              <Button
                onClick={() =>
                  write({
                    args: [stealthMetaInfo.spendingPublicKey, stealthMetaInfo.viewingPublicKey],
                  })
                }>
                Register Stealth Meta Address to Registry
              </Button>
            )}

            {!stealthPin && (
              <Box alignSelf="center">
                <Text>No setup found. Start with a pin but pls don&apos;t forget it 👀</Text>
                <InputGroup mt={4}>
                  <Input type="number" placeholder="Enter Pin" value={pinInput} onChange={(e) => setPinInput(e.target.value)} />
                  <InputRightAddon>#</InputRightAddon>
                </InputGroup>

                <Button colorScheme="blue" mt={4} onClick={onUsePin}>
                  Create your stealth meta address
                </Button>
              </Box>
            )}

            <Box mx="auto" width={'50vw'} mt={8} margin={''}>
              <Button colorScheme="gray" onClick={onResetPin}>
                Reset Pin
              </Button>

              <Box mt={16}>
                <h1>Sender</h1>
              </Box>

              <InputGroup mt={8}>
                <Input
                  type="text"
                  borderColor={col}
                  placeholder="Recipient Address"
                  value={inputMetaAddr}
                  onChange={(e) => setinputMetaAddr(e.target.value)}
                />
              </InputGroup>

              <InputGroup mt={2}>
                <Input type="number" placeholder="Eth Amount" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
                <InputRightAddon>ETH</InputRightAddon>
              </InputGroup>
              <Flex justifyContent={'space-between'} mt={4}>
                <Button colorScheme="blue" onClick={onSendEth} disabled={col !== 'green'}>
                  Send to Stealth Address
                </Button>
              </Flex>
            </Box>
          </Box>
        )}

        {/* <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to bootstrap development.
        </Text> */}
      </main>
    </>
  )
}
