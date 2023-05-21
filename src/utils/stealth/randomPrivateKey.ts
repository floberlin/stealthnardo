// @ts-nocheck

import { utils } from '@noble/secp256k1'

export default function randomPrivateKey() {
  const randPrivateKey = utils.randomPrivateKey()
  return BigInt(`0x${Buffer.from(randPrivateKey, 'hex').toString('hex')}`)
}
