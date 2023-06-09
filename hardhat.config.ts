import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
/** @type import('hardhat/config').HardhatUserConfig */
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import { resolve } from 'path'

const ensContractsPath = './node_modules/@ensdomains/ens-contracts'
// const ensContractsPath = '../ens-contracts'
console.log({ensContractsPath})
process.env.BATCH_GATEWAY_URLS='["https://universal-offchain-unwrapper.ens-cf.workers.dev/"]'
const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
      tags: ['test', 'legacy', 'use_root'],
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 1337,
      // chainId: 31337,
      tags: ['test', 'legacy', 'use_root'],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 1,
    },
    owner2: 2,
    owner3: 3,
  },
  external: {
    contracts: [
      {
        artifacts: [
          resolve(ensContractsPath, 'artifacts'),
          resolve(ensContractsPath, './deployments/archive'),
        ],
        deploy: resolve(ensContractsPath, './build/deploy'),
      },
    ],
  },
};

export default config;
