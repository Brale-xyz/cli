# Smart Recovery Feature - Comprehensive Demo

## Overview

The Smart Recovery feature is an intelligent error recovery system that automatically analyzes failed transfers and provides actionable recovery options. When a transfer fails due to insufficient balance or other funding issues, Smart Recovery:

1. **Analyzes** available balances across all networks and tokens
2. **Generates** recovery options with confidence levels and cost estimates  
3. **Presents** clear, actionable solutions to the user
4. **Executes** multi-step internal operations to prepare funds
5. **Confirms** before any external transfers

## Key Features

### 🔍 **Intelligent Analysis**
- Scans all custodial wallets across networks
- Identifies compatible funding sources
- Calculates required amounts and fees
- Determines optimal recovery paths

### 🛠️ **Recovery Options**
- **Cross-Chain Transfers**: Move same token between networks
- **Token Swaps**: Exchange different tokens on same network  
- **Multi-Step Recovery**: Combine cross-chain + swap operations
- **Confidence Levels**: High/Medium/Low success probability
- **Cost Estimates**: Transparent fee calculations

### 🚀 **Two-Phase Execution**
- **Phase 1**: Internal funding operations (automatic)
- **Phase 2**: External transfer confirmation (user approval)

### 🎯 **Smart Routing**
- Prioritizes high-confidence options
- Minimizes transaction costs
- Reduces execution steps
- Ensures internal wallet safety

## Usage

### Basic Usage
```bash
# Smart Recovery is enabled by default
brale transfer 100 0x1234...abcd SBC base

# Explicitly enable/disable
brale transfer 100 0x1234...abcd SBC base --smart-recovery
brale transfer 100 0x1234...abcd SBC base --no-smart-recovery
```

### Example Scenarios

#### Scenario 1: Cross-Chain Recovery
```
❌ Error creating transfer: Insufficient balance

🔍 Smart Recovery: Analyzing transfer failure...

🛠️ Smart Recovery: Found recovery options!
   Need: 100.00 SBC on base

⭐ Recommended: Transfer 100.00 SBC from canton to base
   Confidence: high
   Time: 2-5 minutes

📋 All recovery options:

1. Transfer 100.00 SBC from canton to base
   Confidence: high | Time: 2-5 minutes
   Steps:
     1. Transfer 100.00 SBC from canton to base

❓ Would you like to proceed with Smart Recovery?
   This will execute internal transfers to prepare funds, then ask for final confirmation.

🔧 Smart Recovery would:
   1. Execute internal funding operations
   2. Prepare the exact amount needed
   3. Ask for final confirmation before external transfer
```

#### Scenario 2: Token Swap Recovery
```
❌ Error creating transfer: Insufficient balance

🔍 Smart Recovery: Analyzing transfer failure...

🛠️ Smart Recovery: Found recovery options!
   Need: 100.00 SBC on base

⭐ Recommended: Swap USDC to SBC on base
   Confidence: medium
   Time: 1-3 minutes
   Cost: ~0.300000 USDC

📋 All recovery options:

1. Swap USDC to SBC on base
   Confidence: medium | Time: 1-3 minutes
   Cost: ~0.300000 USDC
   Steps:
     1. Swap 105.00 USDC to 100.00 SBC
```

#### Scenario 3: Multi-Step Recovery
```
❌ Error creating transfer: Insufficient balance

🔍 Smart Recovery: Analyzing transfer failure...

🛠️ Smart Recovery: Found recovery options!
   Need: 100.00 USDC on polygon

⭐ Recommended: Cross-chain transfer + swap: SBC (canton) → USDC (polygon)
   Confidence: low
   Time: 5-10 minutes
   Cost: ~0.800000 SBC

📋 All recovery options:

1. Cross-chain transfer + swap: SBC (canton) → USDC (polygon)
   Confidence: low | Time: 5-10 minutes
   Cost: ~0.800000 SBC
   Steps:
     1. Transfer 110.00 SBC from canton to polygon
     2. Swap SBC to USDC on polygon
```

#### Scenario 4: No Recovery Options
```
❌ Error creating transfer: Insufficient balance

🔍 Smart Recovery: Analyzing transfer failure...

💔 Smart Recovery: No recovery options available
   Required: 1000.00 SBC on base

💰 Available balances:
   50.00 SBC on canton (Custodial Wallet 1)
   25.00 USDC on base (Custodial Wallet 2)

💡 Recovery suggestions:
   • Check your balance: brale balances
   • View available addresses: brale addresses
   • Try a different network or token
   • Use --smart-recovery flag for automatic funding options
```

## Implementation Details

### Architecture
```
Transfer Command
    ↓ (on error)
Smart Recovery
    ↓
┌─ Analyze Failure ─┐
│  • Get balances   │
│  • Get addresses  │
│  • Find options   │
└───────────────────┘
    ↓
┌─ Generate Options ─┐
│  • Cross-chain     │
│  • Token swaps     │
│  • Multi-step      │
└────────────────────┘
    ↓
┌─ Present & Execute ─┐
│  • Show options     │
│  • User confirmation│
│  • Execute phases   │
└─────────────────────┘
```

### Recovery Option Types

#### 1. Cross-Chain Transfer
- **Use Case**: Same token, different network
- **Example**: SBC on Canton → SBC on Base
- **Confidence**: High
- **Time**: 2-5 minutes

#### 2. Token Swap
- **Use Case**: Different token, same network  
- **Example**: USDC → SBC on Base
- **Confidence**: Medium
- **Time**: 1-3 minutes
- **Cost**: ~0.3% swap fee

#### 3. Multi-Step Recovery
- **Use Case**: Different token + different network
- **Example**: SBC (Canton) → USDC (Polygon)
- **Confidence**: Low
- **Time**: 5-10 minutes
- **Cost**: ~0.8% total fees

### Confidence Levels

#### High Confidence
- Direct transfers between internal wallets
- Same token, different network
- Established bridge connections
- Low failure probability

#### Medium Confidence  
- Token swaps on established DEXs
- Sufficient liquidity available
- Standard swap operations
- Moderate slippage risk

#### Low Confidence
- Multi-step operations
- Complex routing required
- Higher fee accumulation
- Multiple failure points

## Integration Points

### Transfer Command Integration
```typescript
// Enhanced error handling with Smart Recovery
catch (error: any) {
  if (flags['smart-recovery']) {
    const smartRecovery = new SmartRecovery(config, accountId, bearer, this)
    const analysis = await smartRecovery.analyzeTransferFailure(
      args.amount, args.valueType, args.transferType, error
    )
    await smartRecovery.presentRecoveryOptions(analysis)
  }
}
```

### API Integration
- **Balance Analysis**: Uses `getBalances()` to scan all addresses
- **Address Discovery**: Uses `getAddresses()` for routing options
- **Transfer Execution**: Uses `createTransfer()` for internal operations
- **External Address Management**: Automatic creation and reuse

### Future Enhancements

#### Phase 1 (Current)
- ✅ Cross-chain transfer detection
- ✅ Token swap simulation  
- ✅ Multi-step recovery planning
- ✅ Interactive presentation
- ✅ Two-phase execution design

#### Phase 2 (Planned)
- 🔄 DEX integration (Uniswap, 1inch)
- 🔄 Real-time price feeds
- 🔄 Slippage protection
- 🔄 Gas optimization
- 🔄 Success probability ML models

#### Phase 3 (Future)
- 🔄 Cross-chain bridge integration
- 🔄 Automated arbitrage detection
- 🔄 Portfolio rebalancing suggestions
- 🔄 Risk assessment scoring
- 🔄 Historical success analytics

## Testing

The Smart Recovery feature includes comprehensive tests covering:

- ✅ Module import and interface validation
- ✅ Recovery option generation logic
- ✅ Confidence level assignment
- ✅ Integration with transfer command
- ✅ Error handling and fallbacks
- ✅ Type safety and contracts

```bash
npm test  # Runs all tests including Smart Recovery
```

## Benefits

### For Users
- **Reduced Friction**: Automatic problem resolution
- **Transparent Costs**: Clear fee estimates upfront
- **Safe Operations**: Internal-first approach
- **Educational**: Learn about cross-chain operations

### For Developers  
- **Extensible Architecture**: Easy to add new recovery types
- **Type Safety**: Full TypeScript interface contracts
- **Testable**: Comprehensive test coverage
- **Maintainable**: Clear separation of concerns

### For Business
- **Improved UX**: Fewer failed transactions
- **Reduced Support**: Self-service problem resolution
- **Increased Adoption**: Lower barrier to entry
- **Data Insights**: Recovery pattern analytics

## Conclusion

Smart Recovery transforms the Brale CLI from a simple command-line tool into an intelligent financial assistant. By automatically analyzing failed transfers and providing actionable recovery options, it significantly improves the user experience while maintaining the security and transparency that users expect from a professional-grade CLI tool.

The two-phase execution model ensures that users maintain full control over external transfers while benefiting from automated internal operations. This approach strikes the perfect balance between convenience and security, making the Brale CLI more powerful and user-friendly than ever before. 