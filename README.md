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
