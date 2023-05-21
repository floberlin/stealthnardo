import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { stealthMessengerContract } from 'utils/contracts'
import { SCROLL_CHAIN } from 'utils/config'
import optimisticParsing from 'utils/stealth/optimisticParsing'
import privToAddress from 'utils/stealth/privToAddress'

const fromBlock = 2285931 // contract deployment
const toBlock = 'latest'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { viewingPublicKey, spendingPublicKey, viewingPrivateKey, spendingPrivateKey } = req.body
  if (!viewingPublicKey || !spendingPublicKey || !viewingPrivateKey || !spendingPrivateKey) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  const events = await stealthMessengerContract
    .connect(new ethers.providers.JsonRpcProvider(SCROLL_CHAIN.rpcUrls.default.http[0]))
    .queryFilter('Announcement', fromBlock, toBlock)

  const foundAnnouncements = []
  for (const event of events) {
    const success = parseAnnouncement(viewingPublicKey, spendingPublicKey, viewingPrivateKey, spendingPrivateKey)

    if (success) {
      foundAnnouncements.push(event)
    }
  }

  res.status(200).json({ events: foundAnnouncements })
}

function parseAnnouncement(providedEmphemeralKey: string, spendingPublicKey: string, viewingPrivateKey: string, spendingPrivateKey: string) {
  try {
    const stealthInfo = optimisticParsing(providedEmphemeralKey, spendingPublicKey, viewingPrivateKey)

    const stealthAddress = stealthInfo[0]
    const ephemeralPublicKey = stealthInfo[1]
    const hashedSharedSecret = stealthInfo[2]

    const stealthPrivateKey =
      (BigInt(spendingPrivateKey) + BigInt(hashedSharedSecret)) % BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')

    let stealthPrivateKeyString = stealthPrivateKey.toString(16)
    stealthPrivateKeyString = '0x' + stealthPrivateKeyString.padStart(64, '0')

    const parsedStealthAddress = privToAddress(stealthPrivateKey)

    if (stealthAddress !== parsedStealthAddress) {
      return false
    }

    return true
  } catch (err) {
    console.error(err)
  }
}
