// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@ensdomains/ens-contracts/contracts/resolvers/ResolverBase.sol";

import "./IContextResolver.sol";

contract ContextResolver is IContextResolver, ResolverBase {
    event MetadataChanged(
        string name,
        uint256 coinType,
        string graphqlUrl,
        uint8 storageType,
        bytes context
    );
    string public name;
    uint256 public coinType;
    string public graphqlUrl;
    uint8 public storageType;
    bytes public context;

    constructor(
        string memory _name,
        uint256 _coinType,
        string memory _graphqlUrl,
        uint8 _storageType,
        bytes memory _context
    ) {
        name = _name;
        coinType = _coinType;
        graphqlUrl = _graphqlUrl;
        storageType = _storageType;
        context = _context;
        emit MetadataChanged(name, coinType, graphqlUrl, storageType, context);
    }

    function isAuthorised(bytes32) internal pure override returns (bool) {
        return false; // TBD;
    }

    /** @dev Returns the owner of the resolver on L2
     * @return name can be l2 chain name or url if offchain
     * @return coinType according to https://github.com/ensdomains/address-encoder
     * @return graphqlUrl url of graphql endpoint that provides additional information about the offchain name and its subdomains
     * @return storageType 0 = EVM, 1 = Non blockchain, 2 = Starknet
     * @return context can be l2 resolver contract address for evm chain but can be any l2 storage identifier for non evm chain
     */
    function metadata()
        external
        view
        returns (string memory, uint256, string memory, uint8, bytes memory)
    {
        return (name, coinType, graphqlUrl, storageType, context);
    }
}
