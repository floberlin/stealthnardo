import { ethers } from 'ethers'

export function utf8ToHex(utf8: string) {
  const hex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(utf8))

  return hex
}
