import { ethers } from 'ethers'

export function generateStealthMetaAddress(signature: string) {
  console.log('signature', signature)

  const sig1 = signature.slice(2, 66)
  const sig2 = signature.slice(66, 130)

  //   console.log(sig1)
  //   console.log(sig2)

  // Hash "v" and "r" values using SHA-256
  const hashedV = ethers.utils.sha256('0x' + sig1)
  const hashedR = ethers.utils.sha256('0x' + sig2)

  const n = ethers.BigNumber.from('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141')

  // Calculate the private keys by taking the hash values modulo the curve order
  const privateKey1 = ethers.BigNumber.from(hashedV).mod(n)
  const privateKey2 = ethers.BigNumber.from(hashedR).mod(n)

  // Generate the key pairs
  const keyPair1 = new ethers.Wallet(privateKey1.toHexString())
  const keyPair2 = new ethers.Wallet(privateKey2.toHexString())

  const spendingPrivateKey = keyPair1.privateKey
  const viewingPrivateKey = keyPair2.privateKey

  const spendingPublicKey = ethers.utils.computePublicKey(keyPair1.privateKey, true)
  const viewingPublicKey = ethers.utils.computePublicKey(keyPair2.privateKey, true)

  const stealthMetaAddress = `st:eth:${spendingPublicKey}${viewingPublicKey.slice(2)}`

  return {
    spendingPrivateKey,
    viewingPrivateKey,
    spendingPublicKey,
    viewingPublicKey,
    stealthMetaAddress,
  }
}
