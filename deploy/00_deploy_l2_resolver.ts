import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import packet from "dns-packet"

function encodeName(name) {
  return '0x' + packet.name.encode(name).toString('hex')
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const deployArgs = {
    from: deployer,
    args: [],
    log: true,
  }
  const tx = await deploy('L2PublicResolver', deployArgs)

  console.log(`Deployed L2PublicResolver to ${tx.address}`)
  const resolver = await ethers.getContract('L2PublicResolver')

  const node = "0x80ee077a908dffcf32972ba13c2df16b42688e1de21bcf17d3469a8507895eae"
  const address = "0x5a384227b65fa093dec03ec34e111db80a040615"
  console.log(`L2 Public Resolver deployed at  ${resolver.address}`);
  const name = encodeName("test123.eth");
  console.log({name})
  await resolver["setAddrWithName(bytes,address)"](name, address);
  console.log(`setText(bytes32,string,string)`);
  const result = await resolver["addr(bytes32)"](node)
  console.log('***6', result)

  const subname = encodeName("subname.test123.eth");
  console.log({subname})
  await resolver["setAddrWithName(bytes,address)"](subname, address);
  console.log(`setText(bytes32,string,string)`);
  console.log('***5')
  const subsubname = encodeName("a.b.c.d.eth");
  console.log({subsubname})
  await resolver["setAddrWithName(bytes,address)"](subsubname, address);
  console.log(`setText(bytes32,string,string)`);
  console.log('***6')


}

func.tags = ['L2PublicResolver']
func.dependencies = []

export default func
