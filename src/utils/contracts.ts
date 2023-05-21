import { ethers } from 'ethers'
import stealthEscrowArtifact from '../../contracts/out/Escrow.sol/PublicStealthEscrow.json'
import stealthMessengerArtifact from '../../contracts/out/Messenger.sol/IERC5564Messenger.json'
import stealthHandlerArtifact from '../../contracts/out/StealthnardoHandler.sol/StealthHandler.json'
import stealthRegistryArtifact from '../../contracts/out/StealthnardoRegistry.sol/StealthRegistry.json'
import { stealthEscrow, stealthHandler, stealthMessenger, stealthRegistry } from './address'

export const stealthMessengerContract = new ethers.Contract(stealthMessenger, stealthMessengerArtifact.abi)
export const stealthEscrowContract = new ethers.Contract(stealthEscrow, stealthEscrowArtifact.abi)
export const stealthRegistryContract = new ethers.Contract(stealthRegistry, stealthRegistryArtifact.abi)
export const stealthHandlerContract = new ethers.Contract(stealthHandler, stealthHandlerArtifact.abi)
