# CrowdSpark

## About 

### Short Presentation

Our projects aim at solving the problem existing in the population to the global south related to Micro-financing. The crucial issue existing in the lack of accessibility to funding.  Although a lot of crowdfunding platforms were created in web2 to support people to start crowdfunding projects, the crowdfunding platforms are still struggling to help those who are at poor in South Africa. are still a small number of Defi platforms existing on the stellar blockchain. We researched some prototypes of our products from Mojo to maker DAO. We deeply look into the system of Kiva which manages Micro-Lending platform very well.

### Explanation on the use of Stellar

We developped a simple smart contract that allows to lock funds for a specific crowdfunding and unlock the funds conditionnally after a deadline. 
The conditions depends on the target price set by the creator of the crowdfunding and the deadline set as a unix integer in seconds.

We have developped a few view functions and tested the main functions:
- create_crowdfunding 
- donate
- withdraw_funds

We assumed several things like an owner cannot donate to its own crowdfunding and if the target isn't 
achieved the money will come back to the users you participate.


## Addresses (testnet)
### Our contract 
CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ
### Contract address for the native token
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC


## Build and deploy

```
stellar contract build
```

```
stellar contract deploy \                                                             
  --wasm target/wasm32-unknown-unknown/release/crowdfunding.wasm \
  --source alice \
  --network testnet
```

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

# Website : Getting Started

- `cp .env.example .env`
- `npm install`
- `npm run init` (to compile and create the ts bindings)
- `npm run dev`


## Note: 

A lot of functionnalities are unfinished and there are much more to do.
