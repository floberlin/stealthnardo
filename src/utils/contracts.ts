import { ethers } from 'ethers'
import stealthRegistryArtifact from '../../contracts/out/StealthnardoRegistry.sol/StealthRegistry.json'
import stealthHandlerArtifact from '../../contracts/out/StealthnardoHandler.sol/StealthHandler.json'
import { stealthRegistry, stealthHandler } from './address'

export const stealthRegistryContract = new ethers.Contract(stealthRegistry, stealthRegistryArtifact.abi)
export const stealthHandlerContract = new ethers.Contract(stealthHandler, stealthHandlerArtifact.abi)
