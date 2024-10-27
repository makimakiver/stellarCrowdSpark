# CrowdSpark

## About 

### Short Presentation

### Explanation on the use of Stellar

## Addresses (testnet)
### Our contract 
CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ
### Contract address for the native token
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC

## Create a crowdfunding (not yet implemented on frontend):

```
stellar contract invoke --id CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ\
  --source alice \
  --network testnet \
  -- \
  create_crowdfunding --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC\
  --crowdfund_id 111 --user <($stellar keys address alice)> --name 'test' --target_price 100 --deadline <unix in seconds>
```

Example: 
```
stellar contract invoke --id CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ\
  --source alice \
  --network testnet \
  -- \
  create_crowdfunding --token CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC\
  --crowdfund_id 111 --user GD63TY2WYF7PQG6K7IHZ4T2LN4F3G5DRFBTPQ6BOF7SAHZP6VWCGTMUQ --name 'test' --target_price 100 --deadline 1730049354
```

# Getting Started

- `cp .env.example .env`
- `npm install`
- `npm run dev`

# How it works

If you look in [package.json](./package.json), you'll see that the `start` & `dev` scripts first run the [`initialize.js`](./initialize.js) script. This script loops over all contracts in `contracts/*` and, for each:

1. Deploys to a local network (_needs to be running with `docker run` or `soroban network start`_)
2. Saves contract IDs to `.soroban/contract-ids`
3. Generates TS bindings for each into the `packages` folder, which is set up as an [npm workspace](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#workspaces)
4. Create a file in `src/contracts` that imports the contract client and initializes it for the `standalone` network.

You're now ready to import these initialized contract clients in your [Astro templates](https://docs.astro.build/en/core-concepts/astro-syntax/) or your [React, Svelte, Vue, Alpine, Lit, and whatever else JS files](https://docs.astro.build/en/core-concepts/framework-components/#official-ui-framework-integrations). You can see an example of this in [index.astro](./src/pages/index.astro).
