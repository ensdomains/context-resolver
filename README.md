# Context Resolver

This project demonstrates [ENSIP-XX: CCIP-read metadata](https://github.com/ensdomains/docs/blob/d8eac7e0357fb9bb1062925409c2edfd3d42572a/ens-improvement-proposals/ensip-xx-ccip-metadata.md) that allows metadata to be queried directly on the resolver for CCIP-read enabled names.

To simplify the whole process for the demo purpose, both l1 and l2 resolvers will be deployed into the same chain with two different graphql endpoint.
The actual CCIP-read capability is also not included in this demo.

## Setup

### Download the necessary repos

```
git clone https://github.com/ensdomains/ens-l2-subgraph.git
cd ens-l2-subgraph
yarn
cd ..
git clone https://github.com/ensdomains/ens-subgraph.git
cd ens-subgraph
git checkout context
yarn
cd ..
git clone https://github.com/ensdomains/context-resolver.git
cd context-resolver
yarn
```

### Startup docker

The following script startup docker component that includes anvil chain and graph-node

```
npx ens-test-env start --save
```

### Deploy contract

```
yarn deploy
```

The deploy script will perform the followings

- Deploy basic l1 contracts (registry, registrar, resolver)
- register `test123.eth`
- Deploy l2PublicResolver to l2
- Deploy ContextResolver to l1 passing l2PublicResolver as context
- Set the resolver of `test123.eth` into ContextResolver

The deployed contract addresses will be saved under `.env.local`

### Setup subgraph

Assuming you are still at `context-resolver` repo directory, run the following command to update deployed contract address of `subgraph.yml`

```
cp .env.local .env
npx ens-test-env subgraph
```

```
cd ../ens-subgraph
yarn create-local && yarn deploy-local -l 1
```

```
cd ../ens-l2-subgraph
yarn create-local && yarn deploy-local -l 1
```

#### Testing the graphql

```
cd ../context-resolver
yarn test
```

Output

```
Querying L1 GraphqlEndpoint at http://127.0.0.1:8000/subgraphs/name/graphprotocol/ens
{
  resolver: {
    id: '0x36c02da8a0983159322a80ffe9f24b1acff8b570-0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    offchain: {
      name: 'l2 chain',
      id: '0x36c02da8a0983159322a80ffe9f24b1acff8b570',
      graphqlUrl: 'http://localhost:8000/subgraphs/name/ensdomains/ens-l2-subgraph',
      context: '0x0e801d84fa97b50751dbf25036d067dcf18858bf'
    },
    address: '0x36c02da8a0983159322a80ffe9f24b1acff8b570'
  }
}
Querying L2 GraphqlEndpoint at http://localhost:8000/subgraphs/name/ensdomains/ens-l2-subgraph
{
  id: '0x0e801d84fa97b50751dbf25036d067dcf18858bf-0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
  name: 'test123.eth',
  labelName: 'test123',
  resolver: { address: '0x0e801d84fa97b50751dbf25036d067dcf18858bf' },
  subdomains: [ { name: 'subname.test123.eth' } ]
}
```
