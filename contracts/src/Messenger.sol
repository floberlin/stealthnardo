// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

contract IERC5564Messenger {
  /// Emitted when stake is deposited
  event StakeDeposit(address indexed account, uint256 totalStaked);

  event StakeWithdrawal(address indexed account, address withdrawAddress, uint256 amount);

  /// maps paymaster to their stakes
  mapping(address => uint256) public stakes;

  /// return the stake of the account
  function balanceOf(address account) public view returns (uint256) {
    return stakes[account];
  }

  receive() external payable {
    addStake(msg.sender);
  }

  /**
   * add to the account's stake - amount
   * @param staker the address of the staker.
   */
  function addStake(address staker) public payable {
    require(msg.value > 0, 'invalid amount');
    stakes[staker] += msg.value;
    emit StakeDeposit(staker, msg.value);
  }

  /**
   * withdraw the stake.
   * @param withdrawAddress the address to send withdrawn value.
   */
  function withdrawStake(address payable withdrawAddress) external {
    uint256 stake = stakes[msg.sender];
    require(stake > 0, 'No stake to withdraw');
    stakes[msg.sender] = 0;
    emit StakeWithdrawal(msg.sender, withdrawAddress, stake);
    (bool success, ) = withdrawAddress.call{value: stake}('');
    require(success, 'failed to withdraw stake');
  }

  /// @dev Emitted when sending something to a stealth address.
  /// @dev See the `announce` method for documentation on the parameters.
  event Announcement(uint256 indexed schemeId, address indexed stealthAddress, bytes ephemeralPubKey, bytes metadata);

  /// @dev Called by integrators to emit an `Announcement` event.
  /// @param schemeId The applied stealth address scheme (f.e. secp25k1).
  /// @param stealthAddress The computed stealth address for the recipient.
  /// @param ephemeralPubKey Ephemeral public key used by the sender.
  /// @param metadata An arbitrary field MUST include the view tag in the first byte.
  /// Besides the view tag, the metadata can be used by the senders however they like,
  /// but the below guidelines are recommended:
  /// The first byte of the metadata MUST be the view tag.
  /// - When sending ERC-20 tokens, the metadata SHOULD be structured as follows:
  ///   - Byte 1 MUST be the view tag, as specified above.
  ///   - Bytes 2-5 are the method Id, which the hash of the canonical representation of the function to call.
  ///   - Bytes 6-25 are the token contract address.
  ///   - Bytes 26-57 are the amount of tokens being sent.
  /// - When approving a stealth address to spend ERC-20 tokens, the metadata SHOULD be structured as follows:
  ///   - Byte 1 MUST be the view tag, as specified above.
  ///   - Bytes 2-5 are 0xe1f21c67, which the signature for the ERC-20 approve method.
  ///   - Bytes 6-25 are the token address.
  ///   - Bytes 26-57 are the approval amount.
  /// - When sending ERC-721 tokens, the metadata SHOULD be structured as follows:
  ///   - Byte 1 MUST be the view tag, as specified above.
  ///   - Bytes 2-5 are the method Id.
  ///   - Bytes 6-25 are the token address.
  ///   - Bytes 26-57 are the token ID of the token being sent.
  function announce(uint256 schemeId, address stealthAddress, bytes memory ephemeralPubKey, bytes memory metadata) external {
    emit Announcement(schemeId, stealthAddress, ephemeralPubKey, metadata);
  }
}
