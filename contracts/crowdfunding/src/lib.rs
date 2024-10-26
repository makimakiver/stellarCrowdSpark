#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, vec, Env, String, Vec, Timepoint};

#[contract]
pub struct CrowdfundingContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CrowdfundingState {
    pub balance: u32,
    pub target: u32,
    // pub duration: Timepoint,
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

    pub fn init_crowfunding(env: Env, crowdfund_id: u32, target: u32) {
        let state = CrowdfundingState {
            balance: 0,
            target: target,
            time: env.time(),
        };
        env.storage().persistent().set(&crowdfund_id, &state);
    }

    pub fn give(env: Env, amount: u32, crowdfund_id: u32) -> u32{
        let current_state : CrowdfundingState = env.storage().persistent().get(&crowdfund_id).unwrap();
        let new_state = CrowdfundingState {
            balance: current_state.balance + amount,
            target: current_state.target,
        };
        env.storage().persistent().set(&crowdfund_id, &(new_state));
        return new_state.balance;
    }

    pub fn withdraw(env: Env, crowdfund_id: u32) -> Result<(), Error> {
        let current_state : CrowdfundingState = env.storage().persistent().get(&crowdfund_id).unwrap();
        if !current_state.balance >= current_state.target {
            Err(Error::TargetNotAchieved)
        } else {
            env.storage().persistent().set(&crowdfund_id, &CrowdfundingState {
                balance: 0,
                target: 0,
            });
            // Send the money to the project owner
            Ok(())
        }
    }
}

mod test;
