// @ts-nocheck
import keccak256 from 'js-sha3'
import secp from '@noble/secp256k1'
import toEthAddress from './toEthAddress'

export default function optimisticParsing(ephemeralPublicKey_hex: string, spendingPublicKey_hex: string, viewingPrivateKey: string) {
  //console.log("ephemeralPublicKey_hex :",ephemeralPublicKey_hex);

  const ephemeralPublicKey = secp.Point.fromHex(ephemeralPublicKey_hex.slice(2))
  ////console.log('ephemeralPublicKey_hex:', ephemeralPublicKey_hex);

  const spendingPublicKey = secp.Point.fromHex(spendingPublicKey_hex.slice(2))
  //console.log('spendingPublicKey:', spendingPublicKey);

  const sharedSecret = secp.getSharedSecret(BigInt(viewingPrivateKey), ephemeralPublicKey)
  //console.log('sharedSecret:', sharedSecret);

  const hashedSharedSecret = keccak256.keccak256(Buffer.from(sharedSecret.slice(1)))
  //console.log("hashedSharedSecret2 :",hashedSharedSecret);

  const hashedSharedSecretPoint = secp.Point.fromPrivateKey(Buffer.from(hashedSharedSecret, 'hex'))
  //console.log('hashedSharedSecretPoint1:', hashedSharedSecretPoint);

  ////console.log('hashedSharedSecretPoint:', hashedSharedSecretPoint);
  const stealthPublicKey = spendingPublicKey.add(hashedSharedSecretPoint)
  //console.log("stealthPublicKey :",stealthPublicKey.toHex());

  const stealthAddress = toEthAddress(stealthPublicKey.toHex())
  //console.log(stealthAddress);
  //console.log(stealthAddress_given);
  return [stealthAddress, ephemeralPublicKey_hex, '0x' + hashedSharedSecret.toString('hex')]
}
