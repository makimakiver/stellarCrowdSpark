#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, String};

#[test]
fn test_hello_world() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let result = client.give(&1,&2);
    assert_eq!(
        result,
        1
    );
}

#[test]
fn test_add_funds() {
    let env = Env::default();
    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);

    let result = client.give(&1,&2);
    assert_eq!(
        result,
        1
    );
}
