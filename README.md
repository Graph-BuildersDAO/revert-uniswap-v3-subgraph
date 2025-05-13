# Revert Uniswap V3 Subgraph

This repository contains a subgraph implementation for Uniswap V3, optimized and maintained by [Revert Finance](https://github.com/revert-finance) and the Graph-BuildersDAO community.

[Published Repo](https://thegraph.com/explorer/subgraphs/9RtQS9NZy97KCyNCAovNnjjTJ8Brga5jaBs77ffDiXdy?view=Query&chain=arbitrum-one)

## Overview

The Uniswap V3 subgraph indexes and organizes data from Uniswap V3 contracts on various networks. It enables developers to query Uniswap V3 data efficiently through GraphQL.

## Features

- Multi-network support through simple configuration
- Complete Uniswap V3 pool and position tracking
- Price and volume analytics
- Efficient indexing of liquidity changes
- Interval-based aggregated data (hourly, daily)
- Optional grafting support for fast historical data import

## Prerequisites

- Node.js (v18+)
- Yarn
- The Graph CLI (`npm install -g @graphprotocol/graph-cli`)

## Installation

```bash
# Clone the repository
git clone https://github.com/Graph-BuildersDAO/revert-uniswap-v3-subgraph.git
cd revert-uniswap-v3-subgraph

# Install dependencies
yarn
```

## Configuration

### Environment Variables

Copy the example environment file and update it with your settings:

```bash
cp example.env .env
```

Required environment variables for network deployment:

* `FACTORY_STARTBLOCK` - Starting block for the Factory contract
* `FACTORY_CONTRACT_ADDRESS` - Address of the Uniswap V3 Factory contract
* `NONFUNGIBLEPOSITIONMANAGER_STARTBLOCK` - Starting block for the Position Manager
* `NONFUNGIBLEPOSITIONMANAGER_CONTRACT` - Address of the NFT Position Manager contract
* `SUBGRAPH_STUDIO_DEPLOY_KEY` - Your deploy key from Subgraph Studio

Optional environment variables for grafting (incremental deployment):

* `GRAFTING_SUBGRAPH_ID` - ID of the base subgraph to graft from
* `GRAFTING_START_BLOCK` - Block number to start grafting from

### Configuration Files Format

Each network configuration file (`config/{network}/configurations.json`) follows this structure:

```json
{
    "graftEnabled": false,               // Optional: Set to true for grafting
    "subgraphId": "",                    // Required if graftEnabled is true
    "graftStartBlock": "",               // Required if graftEnabled is true
    "network": "mainnet",                // Required: Network identifier
    "factory_startBlock": 1371680,       // Required: Factory contract start block
    "factory_contract_address": "0x33128a8fC17869897dcE68Ed026d694621f6FDfD", // Required
    "nfpm_startBlock": 1371714,          // Required: Position Manager start block
    "nfpm_contract_address": "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1"    // Required
}
```

## Usage

### Adding Network Support

The subgraph supports multiple networks. To add a new network:

```bash
yarn add-network <network-slug>
```

Network slugs can be found in [The Graph documentation](https://thegraph.com/docs/en/supported-networks/).

Example:
```bash
yarn add-network mainnet
yarn add-network arbitrum-one
```

**Important Notes:**
1. After adding a network, you **must** check and update the generated configuration file at `config/{network}/configurations.json`
2. Ensure all required fields are populated (see Configuration Files Format section)

### Building the Subgraph

To build the subgraph for a specific network:

```bash
yarn build-subgraph <network-slug>
```

Example:
```bash
yarn build-subgraph mainnet
```

### Deploying to Subgraph Studio

1. First, create a subgraph on [Subgraph Studio](https://thegraph.com/studio/)
2. Set up your deploy key in your `.env` file:
   ```
   SUBGRAPH_STUDIO_DEPLOY_KEY=your-deploy-key-here
   ```
   Your deploy key can be found on your Subgraph Studio dashboard.

3. Authenticate with The Graph:
   ```bash
   graph auth --studio <deploy-key>
   ```
   Use the same deploy key you added to your `.env` file.

4. Deploy the subgraph:
   ```bash
   yarn deploy-studio <network> <subgraph-name> <version>
   ```

   Example:
   ```bash
   yarn deploy-studio mainnet subgraph-revert 0.0.1
   ```

## Understanding Grafting

Grafting allows you to deploy an updated version of a subgraph while keeping historical data intact. This is useful when:

- Adding new features to an existing subgraph
- Fixing bugs in mappings
- Optimizing subgraph performance

To enable grafting:

1. Set `graftEnabled` to `true` in your network configuration
2. Set `subgraphId` to the ID of the base subgraph (the one you want to graft from)
3. Set `graftStartBlock` to the block number where you want to start indexing from

Example configuration with grafting enabled:
```json
{
    "graftEnabled": true,
    "subgraphId": "QmXDAaE7sT2bVe4prmZgdSXi34EGRjpULTnF9bKi3qrwFB",
    "graftStartBlock": "20427608",
    "network": "mainnet",
    "factory_startBlock": 1371680,
    "factory_contract_address": "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
    "nfpm_startBlock": 1371714,
    "nfpm_contract_address": "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1"
}
```

## Troubleshooting

### Missing Configuration Keys

If you encounter an error like this when running `add-network`:
```
{
    "graftEnabled": false,
    "subgraphId": "",
    "graftStartBlock": "",
    "network": "base",
    "factory_startBlock": null,
    "nfpm_startBlock": null
}
```

Make sure to:
1. Set all required environment variables in your `.env` file
2. Manually update the configuration file with the correct contract addresses and start blocks for your network

### Event Handler Calls Error

If you encounter this error when building:
```
Unexpected key in map: calls
```

Make sure you're using The Graph CLI version 0.41.0 or later, which supports the `calls` field in event handlers.

```bash
npm install -g @graphprotocol/graph-cli@latest
```

## Development

### Local Development with Docker

You can use Docker Compose for local development:

```bash
# Start the local Graph Node
docker-compose up

# In another terminal, deploy to the local Graph Node
yarn codegen
yarn build
yarn deploy-local
```

### Making Changes

1. Modify the schema in `schema.graphql`
2. Update mappings in `src/mappings/`
3. Run codegen to generate TypeScript types:
   ```bash
   yarn codegen
   ```
4. Build and deploy your changes

## Project Structure

- `abis/`: JSON ABI files for Uniswap V3 contracts
- `config/`: Network-specific configuration files
- `src/`: Source code
  - `mappings/`: GraphQL resolvers and event handlers
  - `utils/`: Helper functions
- `schema.graphql`: GraphQL schema definition
- `subgraph.template.yaml`: Template for generating network-specific subgraph manifests
- `scripts/`: Build and deployment scripts

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Uniswap Labs](https://uniswap.org/)
- [The Graph Protocol](https://thegraph.com/)
- [Revert Finance](https://revert.finance/)
- [Graph BuildersDAO](https://github.com/Graph-BuildersDAO)