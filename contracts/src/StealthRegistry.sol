// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import './utils/EllipticCurve.sol';

contract StealthRegistry {
  /// @notice Mapping of addresses to  public key coordinates
  /// @dev Is used by other wallets to generate stealth addresses
  ///  on behalf of the recipient.
  ///  The first mapping maps addresses the key 0 and 1, containing
  ///  the X and the Y coordinate of the public key.
  mapping(address => mapping(uint256 => bytes)) keys;

  /// @dev Event emitted when a user updates their registered stealth keys
  event StealthKeyRegistered(address indexed registrant, bytes spendPub, bytes viewPub);

  error AlreadyRegistered();

  constructor() {}

  /**
   * @notice Returns the stealth key associated with an address
   * @param _spendPub The Spending public key msg.sender.
   * @param _viewPub The Viewing public key msg.sender.
   */
  function registerKey(bytes memory _spendPub, bytes memory _viewPub) external {
    if (compareBytes(keys[msg.sender][0], _spendPub)) {
      revert AlreadyRegistered();
    }
    if (!compareBytes(keys[msg.sender][0], '')) {
      revert AlreadyRegistered();
    }
    keys[msg.sender][0] = _spendPub;
    keys[msg.sender][1] = _viewPub;
    emit StealthKeyRegistered(msg.sender, _spendPub, _viewPub);
  }


  function checkRegistered(address user) external view returns (bool) {
    return !compareBytes(keys[user][0], '');
  }


  function checkValidAndRegistered(bytes memory _spendPub) external view returns (bool) {
    return compareBytes(keys[msg.sender][0], _spendPub);
  }

  function compareBytes(bytes memory a, bytes memory b) internal pure returns (bool) {
    return keccak256(a) == keccak256(b);
  }
}
