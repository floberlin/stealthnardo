// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import './utils/EllipticCurve.sol';

contract StealthRegistry {
  /// @notice Mapping of addresses to  public key coordinates
  /// @dev Is used by other wallets to generate stealth addresses
  ///  on behalf of the recipient.
  ///  The first mapping maps addresses the key 0 and 1, containing
  ///  the X and the Y coordinate of the public key.
  mapping(address => mapping(uint256 => address)) keys;

  /// @dev Event emitted when a user updates their registered stealth keys
  event StealthKeyRegistered(address indexed registrant, address spendPub, address viewPub);

  error AlreadyRegistered();

  constructor() {}

  /**
   * @notice Returns the stealth key associated with an address
   * @param _spendPub The Spending public key msg.sender.
   * @param _viewPub The Viewing public key msg.sender.
   */
  function registerKey(address _spendPub, address _viewPub) external {
    if (keys[msg.sender][0] != address(0)) {
      revert AlreadyRegistered();
    }
    keys[msg.sender][0] = _spendPub;
    keys[msg.sender][1] = _viewPub;
    emit StealthKeyRegistered(msg.sender, _spendPub, _viewPub);
  }

  function checkValidAndRegistered(address _spendPub, address _viewPub) external view returns (bool) {
    return keys[msg.sender][0] == _spendPub && keys[msg.sender][1] == _viewPub;
  }
}
