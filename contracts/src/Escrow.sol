// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

contract PublicStealthEscrow {
  mapping(address => mapping(address => uint256)) public positions;

  function initiatePosition(address stealthAddress, address requiredSigner) public payable {
    positions[requiredSigner][stealthAddress] += msg.value;
  }

  function finalizePosition(address stealthAddress, bytes32 r, bytes32 s, uint8 v, uint256 random) public {
    address signer = getSigner(stealthAddress, r, s, v, random);
    require(positions[signer][stealthAddress] > 0, 'No claimable positions');
    uint256 claimableAmount = positions[signer][stealthAddress];
    positions[signer][stealthAddress] = 0;
    (bool success, ) = stealthAddress.call{value: claimableAmount}('');
    require(success, 'failed to finalize');
  }

  function rescuePosition(address stealthAddress, bytes32 r, bytes32 s, uint8 v, uint256 random) public {
    address signer = getSigner(stealthAddress, r, s, v, random);
    uint256 rescueAmount = positions[signer][stealthAddress];
    positions[signer][stealthAddress] = 0;
    (bool success, ) = signer.call{value: rescueAmount}('');
    require(success, 'failed to rescue');
  }

  function getSigner(address stealthAddress, bytes32 r, bytes32 s, uint8 v, uint256 random) internal pure returns (address signer) {
    bytes32 dataHash = keccak256(abi.encodePacked(stealthAddress, random));
    bytes32 hash = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n32', dataHash));
    return ecrecover(hash, v, r, s);
  }
}
