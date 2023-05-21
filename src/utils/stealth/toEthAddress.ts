import keccak256 from 'js-sha3'

export default function toEthAddress(PublicKey: string) {
  const stAA = keccak256.keccak256(Buffer.from(PublicKey, 'hex').slice(1)).toString()
  return '0x' + stAA.slice(-40)
}
