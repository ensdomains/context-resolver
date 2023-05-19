import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { namehash } from 'ethers/lib/utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()
  const l2PublicResolver = await ethers.getContract("L2PublicResolver");
  const l2ResolverAddress = l2PublicResolver.address
  const deployArgs = {
    from: deployer,
    args: ['l2', 1, 'graphqlurl', 0, l2ResolverAddress],
    log: true,
  }
  const tx = await deploy('ContextResolver', deployArgs)
  const contextResolver = await ethers.getContract("ContextResolver")

  console.log(await contextResolver.metadata())
  console.log(`Deployed Context Resolver to ${tx.address}`)
  const registry = await ethers.getContract("ENSRegistry")
  console.log(1)
  console.log(await registry.resolver(namehash('test123.eth')))
  const _registry = registry.connect(await ethers.getSigner(owner))
  console.log(2)
  await _registry.setResolver(namehash('test123.eth'), contextResolver.address)
  console.log(3)
  console.log(await registry.resolver(namehash('test123.eth')))
  console.log(4)
}

func.tags = ['ContextResolver']
func.dependencies = ['register-unwrapped-names', 'L2PublicResolver']

export default func
