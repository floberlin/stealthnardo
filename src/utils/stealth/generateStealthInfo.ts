import keccak256 from 'js-sha3'
import secp from '@noble/secp256k1'
import randomPrivateKey from './randomPrivateKey'
import toEthAddress from './toEthAddress'

export default function generateStealthInfo(stealthMetaAddress: string, ephemeralPrivateKey: string) {
  //USER = "st:eth:0x03312f36039e1479d10ba17eef98bba5f9a299af277c1dfac2e9134f352892b16603312f36039e1479d10ba17eef98bba5f9a299af277c1dfac2e9134f352892b166";

  const USER = stealthMetaAddress
  if (!USER.startsWith('st:eth:0x')) {
    throw 'Wrong address format; Address must start with `st:eth:0x...`'
  }

  const R_pubkey_spend = secp.Point.fromHex(USER.slice(9, 75))
  //console.log('R_pubkey_spend:', R_pubkey_spend);

  const R_pubkey_view = secp.Point.fromHex(USER.slice(75))

  //  const randomInt = BigInt(`0x${hexString}`);

  const ephemeralPrivateKey = randomPrivateKey()
  //console.log('ephemeralPrivateKey:', "0x" + ephemeralPrivateKey.toString(16));

  const ephemeralPublicKey = secp.getPublicKey(ephemeralPrivateKey, (isCompressed = true))
  //console.log('ephemeralPublicKey:', Buffer.from(ephemeralPublicKey).toString('hex'));

  const sharedSecret = secp.getSharedSecret(ephemeralPrivateKey, R_pubkey_view)
  //console.log('sharedSecret:', sharedSecret);

  var hashedSharedSecret = keccak256.keccak256(Buffer.from(sharedSecret.slice(1)))
  //console.log('hashedSharedSecret:', hashedSharedSecret);

  var ViewTag = hashedSharedSecret.slice(0, 2)
  //console.log('View tag:', ViewTag.toString('hex'));
  const hashedSharedSecretPoint = secp.Point.fromPrivateKey(Buffer.from(hashedSharedSecret, 'hex'))
  //console.log('hashedSharedSecretPoint1:', hashedSharedSecretPoint);
  const stealthPublicKey = R_pubkey_spend.add(hashedSharedSecretPoint)
  //console.log("stealthPublicKey.toHex(): ", stealthPublicKey.toHex());
  const stealthAddress = toEthAddress(stealthPublicKey.toHex())
  //console.log('stealth address:', stealthAddress);
  return {
    stealthAddress: stealthAddress,
    ephemeralPublicKey: '0x' + Buffer.from(ephemeralPublicKey).toString('hex'),
    ViewTag: '0x' + ViewTag.toString('hex'),
    HashedSecret: hashedSharedSecret,
  }
}
