import { ethers } from "hardhat";
import packet from "dns-packet"
import { request, gql } from 'graphql-request'

import { namehash } from 'ethers/lib/utils'
import {
  ENSRegistry as ENSRegistryABI,
} from '@ensdomains/ens-contracts'
import { abi as ContextResolverABI } from './artifacts/contracts/l1/ContextResolver.sol/ContextResolver.json'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
const deploymentAddresses = JSON.parse(
  process.env.DEPLOYMENT_ADDRESSES!,
)
// console.log({deploymentAddresses})

function encodeName(name) {
  return '0x' + packet.name.encode(name).toString('hex')
}
const l1_provider_url = 'http://localhost:8545'
const chainId = 1337
const provider = new ethers.providers.JsonRpcProvider(l1_provider_url);
const l1graphqlUrl = 'http://127.0.0.1:8000/subgraphs/name/graphprotocol/ens'
async function main() {

  const l1query = gql`
  query{
    domains(where:{name:"test123.eth"}){
      name
      resolver{
        id
        offchain {
          name
          id
          graphqlUrl
          context
        }
        address
      }
    }
  }
  `
  const l2query = gql`
  query getDomain($id: String!){
    domains(where:{name:"test123.eth", id:$id}){
      id
      name
      labelName
      resolver{
        address
      }
      subdomains{
        name
      }
    }
  }
  `

  const { domains } = await request(l1graphqlUrl, l1query)
  const resolver = domains[0].resolver
  console.log(`Querying L1 GraphqlEndpoint at ${l1graphqlUrl}`)
  console.log({resolver})
  const l2graphqlUrl = resolver.offchain.graphqlUrl
  const id = `${resolver.offchain.context}-${namehash("test123.eth")}`
  const variables = { id }
  console.log(`Querying L2 GraphqlEndpoint at ${l2graphqlUrl}`)
  const result = await request(l2graphqlUrl, l2query, variables)
  console.log(result.domains[0])

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
