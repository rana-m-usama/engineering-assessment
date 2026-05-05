const express = require('express');
const { tokenContract } = require('../config/web3');

const router = express.Router();

const TOKEN_DECIMALS = parseInt(process.env.TOKEN_DECIMALS, 10) || 6;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

// raw uint256 (BigInt) → decimal string with TOKEN_DECIMALS places
const formatUnits = (raw, decimals) => {
    const divisor = 10n ** BigInt(decimals);
    const whole = raw / divisor;
    const frac = (raw % divisor).toString().padStart(decimals, '0').replace(/0+$/, '');
    return frac ? `${whole}.${frac}` : whole.toString();
};

/**
 * @openapi
 * /api/UsamaApiTest:
 *   get:
 *     summary: Read ERC-20 token state from the configured Sepolia contract
 *     description: |
 *       Calls `name`, `symbol`, `decimals`, `totalSupply`, and `balanceOf(wallet)` on the
 *       token contract specified by `TOKEN_CONTRACT`. `balance` and `totalSupply` are
 *       divided by `10^TOKEN_DECIMALS` (default 6) and returned as decimal strings.
 *     parameters:
 *       - in: query
 *         name: wallet
 *         required: false
 *         schema:
 *           type: string
 *         description: Wallet address to query. Falls back to `WALLET_ADDRESS` env var.
 *     responses:
 *       200:
 *         description: Token state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wallet:      { type: string, example: "0x8012747221C6726B0A5f2E099d34cc7705A3D09b" }
 *                 contract:    { type: string, example: "0x81b743eb527D29278597a4979c1a16c60E95beAc" }
 *                 name:        { type: string, example: "USD" }
 *                 symbol:      { type: string, example: "USD" }
 *                 decimals:    { type: integer, example: 6 }
 *                 totalSupply: { type: string, example: "1000000000" }
 *                 balance:     { type: string, example: "987685201.558203" }
 *       400:
 *         description: Missing wallet (no query param, no env default)
 *       500:
 *         description: RPC failure or contract revert
 */
router.get('/', async (req, res, next) => {
    try {
        const wallet = req.query.wallet || WALLET_ADDRESS;
        if (!wallet) {
            return res.status(400).json({ error: 'wallet address required (query ?wallet= or WALLET_ADDRESS env)' });
        }

        const [name, symbol, decimals, totalSupplyRaw, balanceRaw] = await Promise.all([
            tokenContract.methods.name().call(),
            tokenContract.methods.symbol().call(),
            tokenContract.methods.decimals().call(),
            tokenContract.methods.totalSupply().call(),
            tokenContract.methods.balanceOf(wallet).call(),
        ]);

        const result = {
            wallet,
            contract: process.env.TOKEN_CONTRACT,
            name,
            symbol,
            decimals: Number(decimals),
            totalSupply: formatUnits(totalSupplyRaw, TOKEN_DECIMALS),
            balance: formatUnits(balanceRaw, TOKEN_DECIMALS),
        };

        console.log('[UsamaApiTest]', result);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
