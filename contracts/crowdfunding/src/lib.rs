#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, Map, String,
};

#[contract]
pub struct CrowdfundingContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CrowdfundingState {
    pub owner: Address,
    pub balance: i128,
    pub target_price: i128,
    pub name: String,
    pub deadline: u64,
    pub token: Address,
    pub contributions: Map<Address, i128>,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidDeadline = 1,
    CrowfundingAlreadyClosed = 2,
    CrowfundingStillOpen = 3,
    OwnerCannotDonate = 4,
}

#[contractimpl]
impl CrowdfundingContract {
    pub fn create_crowdfunding(
        env: Env,
        token: Address,
        user: Address,
        crowdfund_id: u32,
        target_price: i128,
        name: String,
        deadline: u64,
    ) -> Result<(), Error> {
        // Only owner can create a crowdfunding: this also ensures less possibility of loss of funds
        user.require_auth();

        let ledger_timestamp = env.ledger().timestamp();
        if deadline < ledger_timestamp {
            return Err(Error::InvalidDeadline);
        }
        let state = CrowdfundingState {
            owner: user,
            balance: 0,
            target_price,
            name,
            deadline,
            token,
            contributions: Map::new(&env),
        };

        // Store the state
        env.storage().persistent().set(&crowdfund_id, &state);
        Ok(())
    }

    pub fn donate(
        env: Env,
        sender: Address,
        amount: i128,
        crowdfund_id: u32,
    ) -> Result<i128, Error> {
        // We need to ensure the sender is authenticated
        sender.require_auth();
        let mut crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        if sender == crowdfunding.owner {
            return Err(Error::OwnerCannotDonate);
        }
        let ledger_timestamp = env.ledger().timestamp();
        if ledger_timestamp > crowdfunding.deadline {
            return Err(Error::CrowfundingAlreadyClosed);
        }

        // Transfer the funds to the contract
        token::Client::new(&env, &crowdfunding.token).transfer(
            &sender,
            &env.current_contract_address(),
            &amount,
        );

        // Update the balance and contributions
        crowdfunding.balance += amount;
        if let Some(prev_value) = crowdfunding.contributions.get(sender.clone()) {
            crowdfunding.contributions.set(sender, prev_value + amount);
        } else {
            crowdfunding.contributions.set(sender, amount);
        }
        env.storage()
            .persistent()
            .set(&crowdfund_id, &(crowdfunding));
        Ok(crowdfunding.balance)
    }

    pub fn withdraw_funds(env: Env, crowdfund_id: u32) -> Result<(), Error> {
        let mut crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        let ledger_timestamp = env.ledger().timestamp();
        if ledger_timestamp < crowdfunding.deadline {
            return Err(Error::CrowfundingStillOpen);
        } else if crowdfunding.balance < crowdfunding.target_price {
            // Send the money back to the contributors
            for (contributor, amount) in crowdfunding.contributions.iter() {
                token::Client::new(&env, &crowdfunding.token).transfer(
                    &env.current_contract_address(),
                    &contributor,
                    &amount,
                );
            }
            crowdfunding.balance = 0;
            env.storage().persistent().set(&crowdfund_id, &crowdfunding);
            return Ok(());
        } else {
            // Send the money to the project owner
            token::Client::new(&env, &crowdfunding.token).transfer(
                &env.current_contract_address(),
                &crowdfunding.owner,
                &crowdfunding.balance,
            );
            crowdfunding.balance = 0;
            env.storage().persistent().set(&crowdfund_id, &crowdfunding);
            return Ok(());
        }
    }


    // View functions

    pub fn get_contribution(env: Env, crowdfund_id: u32, user: Address) -> i128 {
        let crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        if let Some(value) = crowdfunding.contributions.get(user) {
            return value;
        }
        return 0;
    }

    pub fn get_balance(env: Env, crowdfund_id: u32) -> i128 {
        let crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        return crowdfunding.balance;
    }

    pub fn get_crowfunding_data(env: Env, crowdfund_id: u32) -> (Address, i128, String, u64, Address){
        let crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        return (crowdfunding.owner, crowdfunding.target_price, crowdfunding.name, crowdfunding.deadline, crowdfunding.token);
    }

    pub fn get_full_crowfunding_information(env: Env, crowdfund_id: u32) -> CrowdfundingState {
        let crowdfunding: CrowdfundingState =
            env.storage().persistent().get(&crowdfund_id).unwrap();
        return crowdfunding;
    }

}

mod test;
