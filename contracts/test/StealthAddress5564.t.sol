// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/StealthAddress5564.sol";

contract StealthAddress5564Test is Test {
    EIP5564 public stealthAddr;
    address public user1;

    function setUp() public {
        stealthAddr = new EIP5564();
        user1 = address(0x1);
    }

    function testStealthKeys() public {
        vm.prank(user1);
        stealthAddr.stealthKeys(user1);
       
    }

}
