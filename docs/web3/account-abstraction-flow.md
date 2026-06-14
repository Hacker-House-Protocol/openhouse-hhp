# Account Abstraction Flow — ERC-4337 + ZeroDev + Privy

Technical reference for how Hacker House Protocol handles on-chain transactions using Account Abstraction. This document covers the full lifecycle from login to on-chain execution, including all addresses, signing flows, and infrastructure components.

---

## Architecture Overview

HHP uses a **three-layer wallet architecture** to achieve gasless, privacy-preserving transactions:

```
Layer 1: Authentication Wallet (EOA)        → MetaMask, Phantom, etc.
Layer 2: Signing Wallet (EOA)               → Privy Embedded Wallet
Layer 3: Execution Wallet (Smart Account)   → ZeroDev Kernel (ERC-4337)
```

Users never interact with Layer 2 or 3 directly. The platform abstracts all complexity behind a single "Pay My Share" button.

---

## Address Map (Example: user with MetaMask login)

| Address | Type | Role | On-chain activity |
|---|---|---|---|
| `0xAAAA...your_metamask_EOA` | EOA (MetaMask) | Authentication only. Signs a Privy auth message during login. Never touches the blockchain after that. | None |
| `0xBBBB...privy_embedded_EOA` | EOA (Privy Embedded) | Signer for the Kernel smart account. Signs UserOperations off-chain. Created automatically by Privy in the browser. | None (signs off-chain only) |
| `0xCCCC...kernel_smart_account` | Smart Account (ZeroDev Kernel) | Executes all on-chain operations: mint, approve, deposit. Holds USDC and SpotNFTs. Address is deterministically derived from the Embedded wallet. | All on-chain activity |
| `0xDDDD...escrow_contract` | Smart Contract (HackerHouseEscrow) | Escrow contract for a specific Hacker House. Receives USDC deposits and mints SpotNFTs. | Receives deposits, mints NFTs |

### Key relationships

- MetaMask → authenticates with Privy (off-chain only)
- Privy Embedded → signs UserOperations for the Kernel (off-chain only)
- Kernel → derived deterministically from the Embedded address (same signer = same Kernel, always)
- Escrow → deployed per Hacker House via HackerHouseFactory

---

## Detailed Flow

### Step 1 — Login (off-chain)

```
User clicks "Login with MetaMask"
    │
    ├─ Privy opens MetaMask
    ├─ MetaMask (0xAAAA...your_EOA) signs an authentication message
    ├─ Privy validates the signature and creates a session
    ├─ Privy generates an Embedded Wallet (0xBBBB...embedded) in the browser
    │   └─ This wallet is invisible to the user
    │   └─ Private key is managed by Privy's infrastructure
    │   └─ Persists across sessions for the same user
    │
    └─ Nothing touches the blockchain
```

**For social login (email/Google)**: MetaMask is not involved. Privy authenticates via OAuth and creates the Embedded wallet directly. The rest of the flow is identical.

### Step 2 — Kernel Connection (once per session)

Triggered automatically when the user navigates to a Hacker House page with an escrow address.

```
useKernelWallet.connect() executes:
    │
    ├─ Finds the Embedded wallet via Privy SDK
    │   Priority: getEmbeddedConnectedWallet() → privy type → createWallet() → external wallet
    │
    ├─ Creates a viem WalletClient with the Embedded as account
    │   walletClient = createWalletClient({
    │     account: 0xBBBB...privy_embedded_EOA,
    │     chain: arbitrumSepolia,
    │     transport: custom(privyProvider),
    │   })
    │
    ├─ createKernelClient(walletClient)
    │   └─ Creates a ZeroDev Kernel client configured with:
    │       - ECDSA validator (the Embedded is the signer)
    │       - Paymaster (sponsorUserOperation — ZeroDev pays gas)
    │       - Bundler URL (ZeroDev's bundler endpoint)
    │
    ├─ getKernelAddress(walletClient)
    │   └─ Computes the deterministic address: 0xCCCC...kernel_smart_account
    │   └─ This is a counterfactual address — the smart contract may not be deployed yet
    │   └─ It gets deployed automatically on the first transaction
    │
    └─ Hook state: { status: "ready", kernelClient, kernelAddress }
```

**Important**: `kernelAddress` (from `getKernelAddress()`) and `kernelClient.account.address` should be the same value. Both represent the Kernel smart account address.

### Step 3 — Mint USDC (testnet)

User clicks "Mint 10 USDC" on the payment page.

```
handleMint() executes:
    │
    ├─ Builds a UserOperation:
    │   {
    │     target: MockUSDC contract address,
    │     callData: mint(0xCCCC...kernel_smart_account, 10000000),
    │     // 10000000 = 10 USDC (6 decimals)
    │     // Mints TO the Kernel address, not to MetaMask or Embedded
    │   }
    │
    ├─ Embedded (0xBBBB...embedded) signs the UserOperation off-chain
    │   └─ Generates UserOperation hash:
    │      0xabcd...userop_hash_mint
    │   └─ This hash is displayed to the user in the UI
    │
    ├─ Signed UserOp is sent to ZeroDev Bundler (not directly to the blockchain)
    │
    ├─ Bundler:
    │   ├─ Validates the UserOp
    │   ├─ Contacts the Paymaster → Paymaster agrees to sponsor gas
    │   ├─ Packages the UserOp into a real Ethereum transaction
    │   └─ Sends the transaction to Arbitrum Sepolia
    │
    ├─ On-chain execution:
    │   ├─ EntryPoint contract receives the transaction
    │   ├─ Verifies the Embedded's signature against the Kernel's ECDSA validator
    │   ├─ If Kernel is not yet deployed → deploys it (first tx only)
    │   ├─ Kernel calls MockUSDC.mint(0xCCCC...kernel, 10000000)
    │   └─ 10 USDC appear in the Kernel's balance
    │
    └─ Result visible at:
       https://sepolia.arbiscan.io/address/0xCCCC...kernel_smart_account#tokentxns
```

### Step 4 — Deposit (Pay My Share)

User clicks "Pay My Share" after minting USDC.

```
handleDeposit() executes:
    │
    ├─ Builds a BATCH UserOperation (2 calls in one):
    │
    │   Call 1 — Approve:
    │   {
    │     target: MockUSDC contract,
    │     callData: approve(0xDDDD...escrow_contract, 10000000),
    │     // Kernel authorizes the Escrow contract to spend 10 USDC
    │   }
    │
    │   Call 2 — Deposit:
    │   {
    │     target: 0xDDDD...escrow_contract (Escrow),
    │     callData: deposit(bookingId),
    │     // Escrow pulls 10 USDC from the Kernel via transferFrom()
    │     // Escrow mints a SpotNFT to the Kernel
    │   }
    │
    ├─ Embedded (0xBBBB...embedded) signs the batch UserOperation off-chain
    │   └─ Generates UserOperation hash:
    │      0xef01...userop_hash_deposit
    │
    ├─ Signed UserOp → Bundler → Paymaster pays gas → tx sent to Arbitrum Sepolia
    │
    ├─ On-chain execution (both calls execute atomically):
    │   ├─ Kernel calls USDC.approve(Escrow, 10000000)
    │   ├─ Kernel calls Escrow.deposit(bookingId)
    │   ├─ Escrow calls USDC.transferFrom(Kernel, Escrow, 10000000)
    │   ├─ Escrow mints SpotNFT (tokenId = bookingId) to the Kernel
    │   └─ Escrow updates storage: hasDeposited[Kernel] = true, deposits[Kernel] = 10000000
    │
    └─ Results visible at:
       Token txs:  https://sepolia.arbiscan.io/address/0xCCCC...kernel_smart_account#tokentxns
       NFT txs:    https://sepolia.arbiscan.io/address/0xCCCC...kernel_smart_account#nfttransfers
       Escrow:     https://sepolia.arbiscan.io/address/0xDDDD...escrow_contract
```

---

## UserOperation Hashes vs Transaction Hashes

| Type | Example | Where to find |
|---|---|---|
| UserOperation hash | `0xabcd...userop_hash_mint` | Displayed in the HHP UI after signing. Internal to ERC-4337. **Cannot be searched directly on Arbiscan.** |
| Transaction hash | Generated by the Bundler | Visible on Arbiscan under the Kernel address. This is the real Ethereum tx that the Bundler submitted. |

The UserOp hash is the identifier the user sees. The actual tx hash is what appears on Arbiscan. They are different hashes for the same logical operation.

---

## Infrastructure Components

### ZeroDev (Account Abstraction provider)

- **Kernel**: Smart account contract (ERC-4337 compatible). Deployed per user on first transaction.
- **ECDSA Validator**: Plugin that validates signatures from the Embedded wallet EOA.
- **Bundler**: Server that collects UserOperations, packages them into transactions, and submits to the blockchain. Endpoint configured in `lib/zerodev.ts`.
- **Paymaster**: Contract/service that sponsors gas for UserOperations. Configured via `createZeroDevPaymasterClient()`. The user pays zero ETH for any on-chain operation.

### Privy (Authentication + Wallet provider)

- Handles login via MetaMask, Phantom, email, Google, etc.
- Creates and manages Embedded Wallets in the browser
- Provides `getEthereumProvider()` to get a standard EIP-1193 provider for the Embedded wallet

### Viem (Ethereum library)

- `createWalletClient()`: wraps the Privy provider into a standard wallet client
- `createPublicClient()`: used for read-only calls (multicall to escrow, USDC balance checks)
- Read client uses a public RPC (not the Bundler URL) to avoid rate limits

---

## Privacy Model

The three-layer architecture provides **on-chain privacy by default**:

```
Public knowledge (on-chain):
  - Kernel 0xCCCC...kernel deposited 10 USDC into Escrow 0xDDDD...
  - Kernel 0xCCCC...kernel received SpotNFT #X

NOT linkable on-chain:
  - Who owns 0xCCCC...kernel (no ENS, no tx history, fresh address)
  - That 0xAAAA... (user's MetaMask with ENS, tokens, history) is behind it
  - That 0xBBBB... (Privy Embedded) is the signer

Connection only exists in:
  - Privy's auth session (off-chain, encrypted)
  - The browser's local state
```

An observer looking at Arbiscan sees a Kernel smart account interacting with an Escrow contract. They cannot trace it back to the user's personal wallet, ENS name, or any other on-chain identity. This is the **privacy-first** differentiator of HHP.

---

## RPC Architecture

To avoid 429 rate limits, reads and writes use separate endpoints:

```
Reads (contract state queries):
  └─ Public RPC: https://sepolia-rollup.arbitrum.io/rpc
  └─ Singleton client via getPublicClient()
  └─ Uses multicall to batch multiple reads into one RPC call

Writes (UserOperations):
  └─ ZeroDev Bundler: configured via NEXT_PUBLIC_ZERODEV_BUNDLER_URL
  └─ Each write creates its own client instance
```

### Multicall optimization

Each hook batches its reads into a single `multicall`:

- `useEscrowState`: 6 reads → 1 multicall (totalDeposited, cancelled, withdrawDate, depositAmount, capacity, nextBookingId)
- `useBuilderSpot`: 3 reads → 1 multicall (hasDeposited, deposits, builderBooking)
- `usePendingYield`: 3 reads → 1 multicall (pendingYield, yieldDest, totalDeposited)

Total: ~12 individual RPC calls reduced to ~3 multicalls per page load.

---

## Code References

| Component | File | Purpose |
|---|---|---|
| Kernel wallet hook | `hooks/use-kernel-wallet.ts` | Connects Privy wallet to ZeroDev Kernel |
| ZeroDev client setup | `lib/zerodev.ts` | Creates Kernel client, public client, gets Kernel address |
| Deposit hook | `hooks/use-deposit.ts` | Executes approve + deposit batch UserOperation |
| Escrow state hook | `hooks/use-escrow-state.ts` | Reads escrow contract state via multicall |
| Builder spot hook | `hooks/use-builder-spot.ts` | Reads builder deposit status via multicall |
| Pending yield hook | `hooks/use-pending-yield.ts` | Reads GMX yield data via multicall |
| Deposit UI | `app/(protected)/dashboard/hacker-houses/[id]/payment/_components/deposit-section.tsx` | Mint + deposit UI with Arbiscan links |
| Wallet badge | `app/(protected)/_components/wallet-badge.tsx` | Shows connected wallet info in nav |

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_ZERODEV_PROJECT_ID` | ZeroDev project identifier |
| `NEXT_PUBLIC_ZERODEV_BUNDLER_URL` | Bundler endpoint for submitting UserOperations |
| `NEXT_PUBLIC_ZERODEV_PAYMASTER_URL` | Paymaster endpoint for gas sponsorship |
| `NEXT_PUBLIC_ZERODEV_PASSKEY_SERVER_URL` | Passkey server (if using passkey auth) |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | HackerHouseFactory contract address on Arbitrum Sepolia |
| `NEXT_PUBLIC_USDC_ADDRESS` | MockUSDC contract address on Arbitrum Sepolia |
