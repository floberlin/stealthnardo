// @ts-nocheck

import secp from '@noble/secp256k1'

export default function randomPrivateKey() {
  const randPrivateKey = secp.utils.randomPrivateKey()
  return BigInt(`0x${Buffer.from(randPrivateKey, 'hex').toString('hex')}`)
}
