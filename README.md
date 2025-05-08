# Revert Uniswap V3 Subgraph

This repository contains a subgraph implementation for Uniswap V3, optimized and maintained by [Revert Finance](https://github.com/revert-finance) and the Graph-BuildersDAO community.

## Overview

The Uniswap V3 subgraph indexes and organizes data from Uniswap V3 contracts on various networks. It enables developers to query Uniswap V3 data efficiently through GraphQL.

## Features

- Multi-network support through simple configuration
- Complete Uniswap V3 pool and position tracking
- Price and volume analytics
- Efficient indexing of liquidity changes
- Interval-based aggregated data (hourly, daily)

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

### Building the Subgraph

To build the subgraph for a specific network:

```bash
yarn prepare-build <network-slug>
```

Example:
```bash
yarn prepare-build mainnet
```

### Deploying to Subgraph Studio

1. First, create a subgraph on [Subgraph Studio](https://thegraph.com/studio/)
2. Set up your deploy key:
   ```bash
   graph auth --studio <deploy-key>
   ```
   Your deploy key can be found on your Subgraph Studio dashboard.

3. Deploy the subgraph:
   ```bash
   yarn deploy-studio <network> <subgraph-name> <version>
   ```

   Example:
   ```bash
   yarn deploy-studio mainnet revert-subgraph-test 1.0.1
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