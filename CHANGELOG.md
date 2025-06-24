# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-23

###  ** RELEASE **

This release marks the first stable version of the Brale CLI with full API v2 integration and production-ready functionality.

###  **Major Features**
- **Interactive Configuration**: No more confusing required flags - `brale configure` now prompts step-by-step
- **Organized Address Display**: Internal vs external addresses clearly separated with counts
- **Mainnet-Only Balances**: Production-focused balance reporting (excludes testnets)
- **Helpful Error Messages**: Smart guidance when users forget required arguments
- **Cross-Chain Transfers**: Tested and working SBC swaps between networks (Canton ↔ Base)

###  **API Integration**
- **Fixed Balances Endpoint**: Updated to use correct `/accounts/{id}/addresses/{id}/balance` structure
- **OAuth2 Authentication**: Secure token-based API access
- **Current API Compatibility**: Works with latest Brale API endpoints
- **Proper Error Handling**: Meaningful error messages for API failures

###  **User Experience**
- **Command Structure**: Clean, intuitive commands following Brale vernacular
- **Global Installation**: Works from anywhere with `brale` command
- **Account ID Helper**: Automatically shows account ID when missing
- **Transfer Tracking**: Create, list, and monitor transfer status
- **Examples & Help**: Comprehensive help system with usage examples

###  **Architecture**
- **Removed Legacy Commands**: Cleaned up old v1 API commands (mint, redeem, tokens, orders)
- **Fixed Base Command**: Moved BaseCommand out of commands directory to prevent CLI confusion  
- **Updated Dependencies**: Latest oclif framework and TypeScript
- **Mainnet Networks**: Filters out testnets (fuji, solana_devnet, etc.)

### 📊 **Available Commands**
- `brale configure` - Interactive API credential setup
- `brale accounts` - List your accounts
- `brale addresses ACCOUNT_ID` - View internal/external addresses  
- `brale balances ACCOUNT_ID` - Show mainnet custodial wallet balances
- `brale transfers create` - Create transfers (onramp, offramp, swap, payout)
- `brale transfers list ACCOUNT_ID` - List transfer history
- `brale transfers get ACCOUNT_ID TRANSFER_ID` - Get transfer details

###  **Tested Functionality**
-  Account listing and access
-  Address organization (7 internal, 54 external addresses)
-  Mainnet balance reporting ($31,013.69 SBC on Canton)
-  Cross-chain transfers (tested $1 SBC Canton → Base swap)
-  Transfer status tracking (pending → processing)

###  **Migration from v0.2.0**
- **Breaking**: Removed `mint`, `redeem`, `tokens`, `orders` commands
- **Breaking**: `balances` now shows mainnet-only custodial wallet balances
- **Improved**: `configure` is now interactive (no required flags)
- **Enhanced**: `addresses` shows organized internal/external breakdown

### 🎯 **Workflow Example**
```bash
# 1. Setup
brale configure

# 2. Check account
brale accounts

# 3. View addresses  
brale addresses 2MnKwXb5Rdua0fskxLceQwcIauv

# 4. Check balances
brale balances 2MnKwXb5Rdua0fskxLceQwcIauv

# 5. Create transfer
brale transfers create ACCOUNT_ID --amount 100 --currency USD \
  --source-type SBC --source-transfer-type canton --source-address-id ADDR1 \
  --dest-type SBC --dest-transfer-type base --dest-address-id ADDR2
```

## [0.2.0] - 2025-06-23

### Added
- Updated for new Brale API structure
- Transfer-based operations replacing mint/redeem
- Account and address management commands

### Changed  
- Migrated from v1 API to current API endpoints
- OAuth2 authentication implementation
- Command structure aligned with new API

### Removed
- Legacy v1 API integration
- OpenAPI-generated clients

## [0.1.0] - Initial Release

### Added
- Basic CLI structure with oclif framework
- Legacy v1 API integration
- Mint, redeem, tokens, orders commands

## [0.1.2] - Previous Release

### Added
- Initial CLI implementation for Brale v1 API
- Commands: mint, redeem, tokens, orders, addresses
- OAuth2 authentication
- OpenAPI-generated API clients

### Legacy Features (Now Removed)
- Token-based operations
- Mint/redeem workflow
- Generated API clients
- v1 API endpoints

---

## Migration Notes

**Upgrading from v0.1.x to v0.2.x requires workflow changes:**

1. **Get account ID first**: `brale accounts`
2. **Use account-scoped commands**: `brale addresses ACCOUNT_ID`
3. **Use transfers instead of mint/redeem**: `brale transfers create`
4. **Update automation scripts** to use new command structure

See `MIGRATION.md` for complete migration guide.

## Version Support

- **v0.2.x**: Current Brale API (recommended)
- **v0.1.x**: Legacy v1 API (deprecated, no longer supported)

# [0.1.0](https://github.com/Brale-xyz/cli/compare/0.0.9...0.1.0) (2024-01-03)


### Features

* update readme & release ([#21](https://github.com/Brale-xyz/cli/issues/21)) ([f1a8c11](https://github.com/Brale-xyz/cli/commit/f1a8c11e8c3214b8197e5dcfdae649c5daa74f19))



## [0.0.9](https://github.com/Brale-xyz/cli/compare/0.0.8...0.0.9) (2024-01-03)



## [0.0.8](https://github.com/Brale-xyz/cli/compare/0.0.7...0.0.8) (2024-01-03)



## [0.0.7](https://github.com/Brale-xyz/cli/compare/0.0.6...0.0.7) (2024-01-03)



## [0.0.6](https://github.com/Brale-xyz/cli/compare/0.0.5...0.0.6) (2024-01-03)



## [0.0.5](https://github.com/Brale-xyz/cli/compare/0.0.4...0.0.5) (2024-01-03)



## [0.0.4](https://github.com/Brale-xyz/cli/compare/0.0.3...0.0.4) (2024-01-03)



## 0.0.3 (2024-01-03)



