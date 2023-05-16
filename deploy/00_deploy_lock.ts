import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const LockFactory = await ethers.getContractFactory("Lock");
  const tx = await LockFactory.deploy(1);
  console.log(`Deployed Lock to ${tx.address}`)
}

func.tags = ['Lock']
// func.dependencies = ['registry', 'dnssec-oracle']

export default func
