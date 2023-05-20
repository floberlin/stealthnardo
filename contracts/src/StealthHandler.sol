// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import './Escrow.sol';
import './Messenger.sol';

contract StealthHandler {
  IERC5564Messenger messenger;
  PublicStealthEscrow escrow;

  uint256[] public HashedStealthAddresses;

  mapping(address => uint256) public escrowFunding;

  constructor(address payable messengerAddress, address payable escrowAddress) {
    messenger = IERC5564Messenger(messengerAddress);
    escrow = PublicStealthEscrow(escrowAddress);
  }

  // most easy one to try first
  function transferAndAnnounce(address recipient, bytes memory ephemeralPubKey, bytes memory metadata) external payable {
    messenger.announce(1, recipient, ephemeralPubKey, metadata);
    (bool sent, ) = recipient.call{value: msg.value}('');
    require(sent, 'Failed to send Ether');
  }
 
  // function transferAndStakeAndAnnounce(address recipient, bytes memory ephemeralPubKey, bytes memory metadata) external payable {
  //   uint256 txvalue;
  //   if (messenger.balanceOf(msg.sender) == 0) {
  //     require(msg.value >= 0.001 ether, 'not enough ETH');
  //     messenger.addStake{value: 0.001 ether}(msg.sender);
  //     txvalue = msg.value - 0.001 ether;
  //   } else {
  //     txvalue = msg.value;
  //   }

  //   messenger.announce(1, recipient, ephemeralPubKey, metadata);
  //   (bool sent, ) = recipient.call{value: txvalue}('');
  //   require(sent, 'Failed to send Ether');
  // }

  function secureTransferAndAnnounce(
    address recipient,
    bytes memory ephemeralPubKey,
    bytes memory metadata,
    address requiredSigner,
    address spendingAccount,
    uint256 finalGas
  ) external payable {
    uint256 txvalue;
    if (messenger.balanceOf(msg.sender) == 0) {
      require(msg.value >= 0.001 ether, 'not enough ETH');
      messenger.addStake{value: 0.001 ether}(msg.sender);
      txvalue = msg.value - 0.001 ether;
    } else {
      txvalue = msg.value;
    }
    txvalue -= finalGas;
    (bool sent, ) = spendingAccount.call{value: finalGas}('');
    require(sent, 'Failed to send Ether');
    escrowFunding[spendingAccount] += finalGas;

    messenger.announce(2, recipient, ephemeralPubKey, metadata);

    escrow.initiatePosition{value: txvalue}(recipient, requiredSigner);
  }

  function finalizeEscrowPosition(address stealthAddress, bytes32 r, bytes32 s, uint8 v, uint256 random) public {
    escrow.finalizePosition(stealthAddress, r, s, v, random);
  }
}
