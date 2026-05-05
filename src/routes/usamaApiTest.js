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
