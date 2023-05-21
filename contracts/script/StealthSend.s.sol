// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import 'forge-std/Script.sol';
import '../src/StealthHandler.sol';
import '../src/Escrow.sol';
import '../src/Messenger.sol';
import '../src/StealthRegistry.sol';


contract StealthSendScript is Script {

  StealthHandler public stealthHandler;
  PublicStealthEscrow public escrow;
  IERC5564Messenger public messenger;
  StealthRegistry public stealthRegistry;
  function setUp() public {}

  function run() public {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_KEY");

        vm.startBroadcast(deployerPrivateKey);

        messenger = new IERC5564Messenger();
        escrow = new PublicStealthEscrow();
        stealthRegistry = new StealthRegistry();
        stealthHandler = new StealthHandler(payable(address(messenger)), payable(address(escrow)));
    
        vm.stopBroadcast();
    }
}
