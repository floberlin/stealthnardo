import { Box, Button, Center, Flex, Input, InputGroup, InputRightAddon, Text, useColorModeValue } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { useEffect, useState } from 'react'
import { LocalStorageKey } from 'utils/localstorage'
import { generateStealthMetaAddress } from 'utils/stealth/generateStealthAddress'
import generateStealthInfo from 'utils/stealth/generateStealthInfo'
import padToOneByte from 'utils/stealth/padToOneByte'
import { utf8ToHex } from 'utils/stealth/utf8ToHex'
import { useAccount, useContractRead, useContractWrite, useSignMessage, useWaitForTransaction, useWalletClient } from 'wagmi'
import stealthHandlerArtifact from '../../contracts/out/StealthHandler.sol/StealthHandler.json'
import stealthRegistryArtifact from '../../contracts/out/StealthRegistry.sol/StealthRegistry.json'
import { stealthHandler, stealthRegistry } from '../utils/address'
import { parseEther } from 'viem'
import { stealthMessengerContract } from 'utils/contracts'
import { SITE_URL } from 'utils/config'

export default function Home() {
  const [stealthPin, setStealthPin] = useState('')
  const [pinInput, setPinInput] = useState('')
  const [ethAmount, setEthAmount] = useState('')

  const [col, setCol] = useState('red')
  const [col2, setCol2] = useState('red')

  const [inputMetaAddr, setinputMetaAddr] = useState('')
  const [stealthMetaInfo, setStealthMetaInfo] = useState<any>()
  const [announcements, setAnnouncements] = useState([])

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

  const { data: ReadMeta } = useContractRead({
    address: stealthRegistry,
    abi: stealthRegistryArtifact.abi,
    functionName: 'getMeta',
    args: [inputMetaAddr],
    onSuccess(data) {},
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
      setStealthMetaInfo(stealthInfo)
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

    const stealthMetaAddress = `st:eth:${(ReadMeta as unknown as any)[0]} + ${(ReadMeta as unknown as any)[1].slice(2, 9999)}`

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

      tranferWrite({
        args: [sta, ephk, vt],
        value: parseEther(ethAmount as `${number}`),
      })

      // const inputAmountWei = ethers.utils.parseEther(ethAmount)

      // await stealthHandlerContract.transferAndAnnounce(sta, ephk, vt, { value: inputAmountWei }).encodeABI()
    } catch (error) {
      console.log(error)
    }
  }

  async function parseForAnnouncements() {
    // call 'trusted' api for announcements
    // const response = await fetch(`${SITE_URL}/api/parseAnnouncements`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     viewingPublicKey: stealthMetaInfo.viewingPublicKey,
    //     spendingPublicKey: stealthMetaInfo.spendingPublicKey,
    //     viewingPrivateKey: stealthMetaInfo.viewingPrivateKey,
    //     spendingPrivateKey: stealthMetaInfo.spendingPrivateKey
    //   })
    // }
    // )

    // const data = await response.json()
    const data = [
      {
        'Stealth Address': '0x1b5485ea1f250a74473e648ddd58e6e024004361',
        Announcement: '0x0257fec6bbe4ddb7c848acc80603238b3e1ba48cb7adf421139b773a576bcb511d',
        Metadata: '0x53',
      },
      {
        'Stealth Address': '0x5ba3a1b5485eabzaa74473dd58e6e0240012613b',
        Announcement: '0xab21a0ec6bbe4ddb7c848acc80603238b3e1ba48cb7adf421139b773a576bcbeca2',
        Metadata: '0x31',
      },
    ]

    setAnnouncements(data as any)
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
              <>
                <p>
                  Your stealth meta address is: <b>{stealthMetaInfo.stealthMetaAddress}</b>
                </p>
                <Box my={4}>
                  ⬆️ This meta address related to the following keys ⬇️
                  <Flex
                    direction={'column'}
                    border={'2px solid black'}
                    borderRadius={'lg'}
                    p={2}
                    my={4}
                    borderColor={useColorModeValue('gray.100', 'gray.900')}>
                    <Box>
                      <Text>Private:</Text>

                      <Text fontSize={'xs'}>Spending: 0x5d0407bfd1761a5670e0ff55a69b870946e9fca10eaaea627117317621e8f2f2</Text>
                      <Text fontSize={'xs'}>Viewing: 0xb051fe032023db1c13aeb5264cf2d25dd2ee7622ee70a0ad71bbe4f4f656c09c</Text>
                    </Box>
                    <Box>
                      <Text>Public:</Text>

                      <Text fontSize={'xs'}>Spending: 0x03af60115fc5daa7e2530bf5d540cf39674739ef4aa068b74004dc1c790a8704e3</Text>
                      <Text fontSize={'xs'}>Viewing: 0x02d7e855f5ba91431f9a3ee9327892082b71a51811e22f7afed3322bd1c7ff6799</Text>
                    </Box>
                  </Flex>
                </Box>
              </>
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

            <Box mt={4}>
              <Button onClick={() => parseForAnnouncements()}>Parse for Announcements</Button>
            </Box>

            {announcements.length > 0 && (
              <Box mt={4} border={'2px solid black'} borderRadius={'lg'} p={2} my={4} borderColor={useColorModeValue('gray.100', 'gray.900')}>
                <Text>Found announcements</Text>

                {announcements.length > 0 &&
                  announcements.map((a: any) => {
                    return (
                      <Flex key={a.Announcement as string} alignItems={'center'} my={2}>
                        <p>{a['Stealth Address'] as string}</p>
                        <Button ml={4} size="sm">
                          Get Private Key
                        </Button>
                      </Flex>
                    )
                  })}
              </Box>
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
