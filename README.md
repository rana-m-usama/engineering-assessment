# Engineering Assessment — Web3 ERC-20 Reader

A single Express endpoint that reads ERC-20 token state (`name`, `symbol`,
`decimals`, `totalSupply`, `balanceOf`) from a Sepolia-deployed contract using
[`web3.js`](https://web3js.readthedocs.io/), with Swagger UI for the endpoint
and a Railway deployment config.

---

## Endpoint

`GET /api/UsamaApiTest?wallet=<address>`

| Field         | Description                                              |
| ------------- | -------------------------------------------------------- |
| `wallet`      | Address that was queried                                 |
| `contract`    | Token contract address                                   |
| `name`        | `name()` from the token                                  |
| `symbol`      | `symbol()` from the token                                |
| `decimals`    | `decimals()` from the token                              |
| `totalSupply` | `totalSupply()` divided by `10^TOKEN_DECIMALS` (string)  |
| `balance`     | `balanceOf(wallet)` divided by `10^TOKEN_DECIMALS` (str) |

Wallet resolution: `?wallet=` query → `WALLET_ADDRESS` env var. The result is
also `console.log`'d on every request, per the assessment brief.

Example (Sepolia):

```json
{
  "wallet": "0x8012747221C6726B0A5f2E099d34cc7705A3D09b",
  "contract": "0x81b743eb527D29278597a4979c1a16c60E95beAc",
  "name": "USD",
  "symbol": "USD",
  "decimals": 6,
  "totalSupply": "1000000000",
  "balance": "987685201.558203"
}
```

---

## Local development

```bash
npm install
cp .env.example .env       # then fill in RPC_URL etc.
npm run dev                # nodemon
# or
npm start                  # plain node
```

Then:
- `http://localhost:3001/api/UsamaApiTest`
- `http://localhost:3001/api-docs` (Swagger UI)

### Environment variables

| Var              | Required | Example                                                       |
| ---------------- | -------- | ------------------------------------------------------------- |
| `PORT`           | no (3001)| `3001`                                                        |
| `RPC_URL`        | yes      | `https://eth-sepolia.g.alchemy.com/v2/<KEY>`                  |
| `TOKEN_CONTRACT` | yes      | `0x81b743eb527D29278597a4979c1a16c60E95beAc`                  |
| `WALLET_ADDRESS` | no       | `0x8012747221C6726B0A5f2E099d34cc7705A3D09b`                  |
| `TOKEN_DECIMALS` | no (6)   | `6`                                                           |

`balance` and `totalSupply` are divided by `10^TOKEN_DECIMALS`.

---

## Deploy to Railway

1. Push this repo to GitHub.
2. In Railway, **New Project → Deploy from GitHub** and pick this repo.
3. Under **Variables**, add:
   - `RPC_URL`
   - `TOKEN_CONTRACT`
   - `WALLET_ADDRESS`
   - `TOKEN_DECIMALS=6`

   `PORT` is injected by Railway automatically.
4. Wait for the build. Railway uses [`railway.json`](railway.json):
   - Builder: NIXPACKS
   - Start command: `npm start`
   - Restart policy: `ON_FAILURE`, max 5 retries
5. Open the generated public URL → `/api/UsamaApiTest` and `/api-docs`.

---

## API Docs

Swagger UI is mounted at `/api-docs` and the raw OpenAPI 3.0 spec at
`/api-docs.json`. Only the assessment endpoint is documented (single endpoint,
per the spec).
