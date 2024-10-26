#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, vec, Address, BytesN, Env, String, Timepoint, Vec};

#[contract]
pub struct CrowdfundingContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CrowdfundingState {
    pub owner : Address,
    pub balance: u32,
    pub target_price: u32,
    pub name: String,
    pub deadline: Timepoint,
    pub project_description: BytesN<32>,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    TargetNotAchieved = 1,
}

#[contractimpl]
impl CrowdfundingContract {
    pub fn hello(env: Env, to: String) -> Vec<String> {
        vec![&env, String::from_str(&env, "Hello"), to]
    }

    pub fn init_crowfunding(env: Env, crowdfund_id: u32, target: u32, name: String, deadline: Timepoint, project_description: BytesN<32>) {
        let state = CrowdfundingState {
            balance: 0,
            target_price: target,
            name,
            deadline,
            project_description,
        };
        env.storage().persistent().set(&crowdfund_id, &state);
    }

    pub fn give(env: Env, amount: u32, crowdfund_id: u32) -> u32{
        let mut current_state : CrowdfundingState = env.storage().persistent().get(&crowdfund_id).unwrap();
        current_state.balance += amount;
        env.storage().persistent().set(&crowdfund_id, &(current_state));
        return current_state.balance;
    }

    pub fn withdraw(env: Env, crowdfund_id: u32) -> Result<(), Error> {
        let mut current_state : CrowdfundingState = env.storage().persistent().get(&crowdfund_id).unwrap();
        if current_state.balance < current_state.target_price {
            Err(Error::TargetNotAchieved)
        } else {
            current_state.balance = 0;
            current_state.target_price = 0;
            env.storage().persistent().set(&crowdfund_id, &current_state);
            // Send the money to the project owner
            Ok(())
        }
    }
}

mod test;
