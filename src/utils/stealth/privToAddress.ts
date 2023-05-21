// @ts-nocheck
import secp from '@noble/secp256k1'
import toEthAddress from './toEthAddress'

export default function privToAddress(stealthPrivateKey: bigint) {
  const stealthPublicKey = secp.Point.fromPrivateKey(stealthPrivateKey)
  const stealthAddress = toEthAddress(stealthPublicKey.toHex())

  return stealthPublicKey.toHex((isCompressed = true)), stealthAddress
}
