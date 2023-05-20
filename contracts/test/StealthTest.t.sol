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
    stealthHandler.transferAndAnnounce{value: 1 ether}(0xF15F07B1573BA780aa5C0ff6995020fC129C450c, '0x1234', '0x5678');
    uint256 bal = address(0xF15F07B1573BA780aa5C0ff6995020fC129C450c).balance;
    assertEq(bal, 1 ether);
  }

  function testTransferAndStakeAndAnnounce() public {
    stealthHandler.transferAndStakeAndAnnounce{value: 1 ether}(0xF15F07B1573BA780aa5C0ff6995020fC129C450c, '0x1234', '0x5678');
    uint256 bal = address(0xF15F07B1573BA780aa5C0ff6995020fC129C450c).balance;
    uint256 balMsgr = messenger.balanceOf(address(this));
    assertEq(bal, 999000000000000000);
    assertEq(balMsgr, 1000000000000000);
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
