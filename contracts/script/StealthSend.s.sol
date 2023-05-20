// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import 'forge-std/Script.sol';
import '../src/StealthHandler.sol';
import '../src/Escrow.sol';
import '../src/Messenger.sol';


contract StealthSendScript is Script {
  function setUp() public {}

  function run() public {
        uint256 deployerPrivateKey = vm.envUint("PK");

        vm.startBroadcast(deployerPrivateKey);

        messenger = new IERC5564Messenger();
        escrow = new PublicStealthEscrow();
        stealthHandler = new StealthHandler(payable(address(messenger)), payable(address(escrow)));
    
        vm.stopBroadcast();
    }
}
