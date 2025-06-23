# Brale CLI

![npm (scoped)](https://img.shields.io/npm/v/%40brale/cli?style=flat-square&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40brale%2Fcli)
![GitHub License](https://img.shields.io/github/license/Brale-xyz/cli?style=flat-square&link=https%3A%2F%2Fgithub.com%2FBrale-xyz%2Fcli%2Fblob%2Fmain%2FLICENSE)

The Brale CLI is a command-line interface designed to simplify and streamline stablecoin transfers and API interactions with the [Brale API](https://docs.brale.xyz/reference). Send stablecoins to any wallet with a single command, or use the full suite of commands for complete control.

**New: Unified Transfer Command** - Send stablecoins from your custodial wallet to any external wallet with just 4 arguments!

Under the hood, the CLI uses [oclif](https://oclif.io/) for the UX and connects directly to the Brale API endpoints at `https://api.brale.xyz`.

<!-- toc -->

- [Brale CLI](#brale-cli)
- [Quick Start](#quick-start)
- [Unified Transfer Command](#unified-transfer-command)
- [Smart Recovery](#smart-recovery)
- [Usage](#usage)
- [Commands](#commands)
- [Advanced Usage](#advanced-usage)
<!-- tocstop -->

# Quick Start

Get up and running in 3 simple steps:

```bash
# 1. Install
npm install -g @brale/cli

# 2. Configure (interactive setup)
brale configure

# 3. Send stablecoins to any wallet
brale transfer 100 0x1234...abcd SBC base
```

That's it! The CLI handles all the complexity behind the scenes.

# Unified Transfer Command

The `brale transfer` command is the simplest way to send stablecoins from your custodial wallet to any external wallet address.

## Syntax
```bash
brale transfer <amount> <wallet> <token> <network>
```

## Examples
```bash
# Send 100 SBC to external wallet on Base
brale transfer 100 0x26ECe47A7a7DF6692dD11F42C1B465116a7B068d SBC base

# Send 50 USDC on Polygon
brale transfer 50 0x5678...efgh USDC polygon

# Send 25 SBC on Ethereum
brale transfer 25 0x9abc...def0 SBC ethereum

# Preview transfer without executing
brale transfer 100 0x1234...abcd SBC base --dry-run
```

## What Happens Behind the Scenes

When you run `brale transfer`, the CLI automatically:

1. **Authenticates** using your stored credentials
2. **Finds your account** (or uses the one you specify)
3. **Selects a compatible source address** from your custodial wallets
4. **Finds or creates an external address** for the destination wallet
5. **Executes the transfer** with proper idempotency protection

No need to remember account IDs, address IDs, or deal with complex API parameters!

## Supported Networks

- **Ethereum**: `ethereum`
- **Base**: `base`
- **Polygon**: `polygon`
- **Arbitrum**: `arbitrum`
- **Optimism**: `optimism`
- **Avalanche**: `avalanche`
- **Celo**: `celo`
- **Solana**: `solana`
- **BNB Chain**: `bnb`
- **Canton**: `canton`

## Supported Tokens

- **SBC** (Stablecoin by Brale)
- **USDC**
- **USD** (for fiat operations)

# Smart Recovery

When transfers fail due to insufficient balance, Smart Recovery automatically:

**Analyzes** your available balances across all networks and tokens  
**Generates** recovery options with confidence levels and cost estimates  
**Executes** multi-step internal operations to prepare funds  
**Confirms** before any external transfers

## How It Works

Smart Recovery can handle complex scenarios like:
- **Cross-Chain Transfers**: Move SBC from Canton to Base automatically
- **Token Swaps**: Convert USDC to SBC on the same network  
- **Multi-Step Recovery**: Combine cross-chain + swap operations
- **Cost Estimation**: Shows fees and time estimates upfront

## Enable/Disable Smart Recovery

```bash
# Enabled by default
brale transfer 100 0x1234...abcd SBC base

# Explicitly control
brale transfer 100 0x1234...abcd SBC base --smart-recovery
brale transfer 100 0x1234...abcd SBC base --no-smart-recovery
```

## Example Recovery Scenario

```
Error creating transfer: Insufficient balance

Smart Recovery: Analyzing transfer failure...
Smart Recovery: Found recovery options!

Recommended: Transfer 100.00 SBC from canton to base
   Confidence: high | Time: 2-5 minutes

Would you like to proceed with Smart Recovery? (y/N)
```

See [Smart Recovery Demo](SMART_RECOVERY_DEMO.md) for detailed examples and scenarios.

# Usage

## Installation & Setup

```bash
# Install globally
npm install -g @brale/cli

# Interactive configuration (recommended)
brale configure

# Or configure with flags
brale configure --client-id $CLIENT_ID --client-secret $CLIENT_SECRET
```

You'll need API credentials from your [Brale Dashboard](https://app.brale.xyz).

## Basic Commands

```bash
# Send stablecoins (unified command)
brale transfer 100 0x1234...abcd SBC base

# Check your account
brale accounts

# View your addresses and balances
brale addresses
brale balances

# Get shareable wallet addresses
brale internal-wallets

# View transfer history
brale transfers list

# Check transfer status
brale transfers get <account-id> <transfer-id>
```

# Commands

<!-- commands -->

- [`brale accounts`](#brale-accounts)
- [`brale addresses [ACCOUNTID]`](#brale-addresses-accountid)
- [`brale balances [ACCOUNTID]`](#brale-balances-accountid)
- [`brale configure`](#brale-configure)
- [`brale help [COMMANDS]`](#brale-help-commands)
- [`brale internal-wallets`](#brale-internal-wallets)
- [`brale transfer AMOUNT WALLET VALUETYPE TRANSFERTYPE`](#brale-transfer-amount-wallet-valuetype-transfertype)
- [`brale transfers create ACCOUNTID`](#brale-transfers-create-accountid)
- [`brale transfers get ACCOUNTID TRANSFERID`](#brale-transfers-get-accountid-transferid)
- [`brale transfers list ACCOUNTID`](#brale-transfers-list-accountid)

## `brale transfer AMOUNT WALLET VALUETYPE TRANSFERTYPE`

**Send tokens from your custodial wallet to an external wallet**

```
USAGE
  $ brale transfer AMOUNT WALLET VALUETYPE TRANSFERTYPE [--json] [-r] [-a <value>] [-s <value>]
    [-n <value>] [-m <value>] [-d]

ARGUMENTS
  AMOUNT        Amount to transfer
  WALLET        Destination wallet address
  VALUETYPE     Value type (SBC, USDC, etc.)
  TRANSFERTYPE  Transfer type (base, ethereum, polygon, etc.)

FLAGS
  -a, --account-id=<value>         Account ID (if not provided, will use first available account)
  -d, --dry-run                    Show what would be transferred without executing
  -m, --memo=<value>               Transfer memo
  -n, --note=<value>               Transfer note
  -r, --raw                        Output raw JSON (defaults to a table)
  -s, --source-address-id=<value>  Source address ID (if not provided, will auto-select compatible address)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Send tokens from your custodial wallet to an external wallet

EXAMPLES
  $ brale transfer 100 0x1234...abcd SBC base
  $ brale transfer 50 0x5678...efgh USDC polygon
  $ brale transfer 25 0x9abc...def0 SBC ethereum
```

## `brale accounts`

List your accounts

```
USAGE
  $ brale accounts [--json] [-r]

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List your accounts
```

## `brale addresses [ACCOUNTID]`

List addresses for an account

```
USAGE
  $ brale addresses [ACCOUNTID] [--json] [-r]

ARGUMENTS
  ACCOUNTID  Account ID (optional - will use first account if not provided)

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List addresses for an account

  Shows both internal (custodial) and external addresses.
  Internal addresses are managed by Brale and created automatically.
  External addresses are wallets you've registered for transfers.
```

## `brale balances [ACCOUNTID]`

List balances for an account

```
USAGE
  $ brale balances [ACCOUNTID] [--json] [-r]

ARGUMENTS
  ACCOUNTID  Account ID (optional - will use first account if not provided)

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List balances for an account

  Shows balances across all mainnet networks for your custodial addresses.
```

## `brale configure`

Configure API credentials

```
USAGE
  $ brale configure [--json] [-r] [-h <value>] [-a <value>] [-i <value>] [-s <value>]

FLAGS
  -a, --auth-host=<value>      Token Auth Host (default: https://auth.brale.xyz)
  -h, --api-host=<value>       API Host (default: https://api.brale.xyz)
  -i, --client-id=<value>      API Client ID
  -r, --raw                    Output raw JSON (defaults to a table)
  -s, --client-secret=<value>  API Client Secret

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Configure API credentials

  Interactive setup if no flags provided. Get credentials from https://app.brale.xyz
```

## `brale internal-wallets`

**Show your custodial wallet addresses that can be shared with external parties**

```
USAGE
  $ brale internal-wallets [--json] [-r] [-f table|addresses|json] [-n
    ethereum|base|polygon|arbitrum|optimism|avalanche|celo|solana|bnb|canton]

FLAGS
  -f, --format=<option>   [default: table] output format
                          <options: table|addresses|json>
  -n, --network=<option>  filter by specific network
                          <options:
                          ethereum|base|polygon|arbitrum|optimism|avalanche|celo|solana|bnb|canton>
  -r, --raw               Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Show your custodial wallet addresses that can be shared with external parties

  These are the actual on-chain wallet addresses from your custodial accounts that you can 
  share with external parties to receive funds. This command clarifies the distinction 
  between Brale's internal address management and actual shareable wallet addresses.

EXAMPLES
  $ brale internal-wallets
  $ brale internal-wallets --format addresses
  $ brale internal-wallets --network base
  $ brale internal-wallets --network canton --format json
```

## `brale transfers create ACCOUNTID`

Create a new transfer (advanced usage)

```
USAGE
  $ brale transfers create ACCOUNTID -a <value> -c <value> --source-type <value> --source-transfer-type <value> --dest-type <value> --dest-transfer-type <value> [--json] [-r] [--dest-address-id <value>] [--source-address-id <value>] [--dest-fi-id <value>] [--source-fi-id <value>] [-n <value>] [-m <value>]

ARGUMENTS
  ACCOUNTID  Account ID to create transfer for

FLAGS
  -a, --amount=<value>                      (required) Amount to transfer
  -c, --currency=<value>                    (required) Currency (USD, USDC, etc.)
  -m, --memo=<value>                        Transfer memo
  -n, --note=<value>                        Transfer note
  -r, --raw                                 Output raw JSON (defaults to a table)
      --dest-address-id=<value>             Destination address ID (for stablecoin destinations)
      --dest-fi-id=<value>                  Destination financial institution ID (for fiat destinations)
      --dest-transfer-type=<value>          (required) Destination transfer type (wire, ach, polygon, solana, etc.)
      --dest-type=<value>                   (required) Destination value type (USD, USDC, SBC, etc.)
      --source-address-id=<value>           Source address ID (for stablecoin sources)
      --source-fi-id=<value>                Source financial institution ID (for fiat sources)
      --source-transfer-type=<value>        (required) Source transfer type (wire, ach, polygon, solana, etc.)
      --source-type=<value>                 (required) Source value type (USD, USDC, SBC, etc.)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a new transfer (advanced usage)

  For simple external wallet transfers, use 'brale transfer' instead.

EXAMPLES
  $ brale transfers create 2Js1YFqlfxgNqC2KTPEjrWIwKU7 --amount 100 --currency USD --source-type USD --source-transfer-type wire --dest-type SBC --dest-transfer-type base --dest-address-id 2MhCCIHulVdXrHiEuQDJvnKbSkl
```

## `brale transfers get ACCOUNTID TRANSFERID`

Get a specific transfer by ID

```
USAGE
  $ brale transfers get ACCOUNTID TRANSFERID [--json] [-r]

ARGUMENTS
  ACCOUNTID   Account ID
  TRANSFERID  Transfer ID to retrieve

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get a specific transfer by ID
```

## `brale transfers list ACCOUNTID`

List transfers for an account

```
USAGE
  $ brale transfers list ACCOUNTID [--json] [-r]

ARGUMENTS
  ACCOUNTID  Account ID to list transfers for

FLAGS
  -r, --raw  Output raw JSON (defaults to a table)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List transfers for an account
```

<!-- commandsstop -->

# Advanced Usage

## Transfer Types

The CLI supports all types of transfers supported by the Brale API:

### Simple External Transfer (Recommended)
Use the unified `transfer` command for sending to external wallets:
```bash
brale transfer 100 0x1234...abcd SBC base
```

### Onramp (Fiat → Stablecoin)
```bash
brale transfers create ACCOUNT_ID \
  --amount 100 --currency USD \
  --source-type USD --source-transfer-type wire \
  --dest-type SBC --dest-transfer-type base \
  --dest-address-id ADDRESS_ID
```

### Offramp (Stablecoin → Fiat)
```bash
brale transfers create ACCOUNT_ID \
  --amount 100 --currency USD \
  --source-type SBC --source-transfer-type polygon \
  --source-address-id ADDRESS_ID \
  --dest-type USD --dest-transfer-type wire \
  --dest-fi-id BANK_ID
```

### Cross-Chain Swap
```bash
brale transfers create ACCOUNT_ID \
  --amount 100 --currency USD \
  --source-type SBC --source-transfer-type canton \
  --source-address-id CANTON_ADDRESS_ID \
  --dest-type SBC --dest-transfer-type base \
  --dest-address-id BASE_ADDRESS_ID
```

## Getting Shareable Wallet Addresses

Use `brale internal-wallets` to get wallet addresses you can share with external parties for incoming transfers:

```bash
# Show all internal wallets in a table
brale internal-wallets

# Filter by specific network
brale internal-wallets --network base
brale internal-wallets --network ethereum

# Get just addresses (for scripting)
brale internal-wallets --format addresses

# Export as JSON
brale internal-wallets --format json
```

These addresses are your **custodial wallets** managed by Brale. You can safely share them with others to receive stablecoins.

## Workflow Examples

### Basic User Flow
```bash
# 1. Configure once
brale configure

# 2. Check your setup
brale accounts
brale balances

# 3. Send stablecoins
brale transfer 50 0x1234...abcd SBC base

# 4. Track the transfer
brale transfers list $(brale accounts --raw | jq -r '.accounts[0]')
```

### Power User Flow
```bash
# Get detailed account info
ACCOUNT_ID=$(brale accounts --raw | jq -r '.accounts[0]')

# View all addresses
brale addresses $ACCOUNT_ID --raw

# Create complex transfer with specific source
brale transfers create $ACCOUNT_ID \
  --amount 1000 --currency USD \
  --source-type SBC --source-transfer-type polygon \
  --source-address-id SPECIFIC_ADDRESS_ID \
  --dest-type USDC --dest-transfer-type ethereum \
  --dest-address-id TARGET_ADDRESS_ID
```

## Key Features

**Unified Transfer Command:** Send stablecoins to any wallet with just 4 arguments  
**Smart Recovery:** Automatic funding and cross-chain operations  
**Multi-Network Support:** All major EVM chains plus Solana  
**Custodial Wallets:** Managed addresses for receiving funds  
**Real-time Status:** Track transfers from creation to completion

## Getting Help

- **Documentation**: [https://docs.brale.xyz](https://docs.brale.xyz)
- **API Reference**: [https://docs.brale.xyz/reference](https://docs.brale.xyz/reference)
- **Dashboard**: [https://app.brale.xyz](https://app.brale.xyz)
- **Support**: [support@brale.xyz](mailto:support@brale.xyz)

## Development

This CLI is built with [oclif](https://oclif.io/). To contribute:

```bash
# Clone and setup
git clone https://github.com/Brale-xyz/cli
cd cli
npm install

# Development workflow
npm run dev -- --help          # Run CLI in development mode
npm run build                   # Build for production
npm run test                    # Run tests
npm run test:coverage           # Run tests with coverage
npm run lint                    # Check code style
npm run lint:fix                # Fix code style issues

# Before committing
npm run clean                   # Clean build artifacts
npm run prepack                 # Full build + generate docs
```

### Project Structure

```
src/
├── commands/           # CLI commands
├── lib/               # Shared utilities
│   ├── smart-recovery.ts  # Smart Recovery system
│   ├── address-utils.ts   # Address management
│   ├── balance-utils.ts   # Balance formatting
│   └── base.ts           # Base command class
├── api.ts             # Brale API client
└── oauth.ts           # Authentication
```

Updated about 1 month ago
