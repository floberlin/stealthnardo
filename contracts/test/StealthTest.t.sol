// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import 'forge-std/Test.sol';
import '../src/StealthnardoHandler.sol';
import '../src/Escrow.sol';
import '../src/Messenger.sol';

contract StealthTest is Test {
  StealthHandler public stealthHandler;
  PublicStealthEscrow public escrow;
  IERC5564Messenger public messenger;
  address public user1;

  function setUp() public {
    messenger = new IERC5564Messenger();
    escrow = new PublicStealthEscrow();
    stealthHandler = new StealthHandler(payable(address(messenger)), payable(address(escrow)));
    user1 = address(0x1);
  }

  function testTransferAndAnnounce() public {
    stealthHandler.transferAndAnnounce(user1, '0x1234', '0x5678');
    
  }

  //   function testStealthKeys() public {
  //     vm.prank(user1);
  //     (uint256 PublicKeyX, uint256 PublicKeyY) = stealthRegistry.stealthKeys(user1);
  //     // user not registrated
  //     assertEq(PublicKeyX, 0);
  //     assertEq(PublicKeyY, 0);

  //     // register user
  //     stealthRegistry.registerKey(user1, 1, 2);
  //     (PublicKeyX, PublicKeyY) = stealthRegistry.stealthKeys(user1);
  //     assertEq(PublicKeyX, 1);
  //     assertEq(PublicKeyY, 2);
  //   }
}
