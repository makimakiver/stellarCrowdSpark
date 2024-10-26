#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env};
use token::{StellarAssetClient, TokenClient};
use soroban_sdk::testutils::{Address as _, Ledger};


fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(e, &sac.address()),
        token::StellarAssetClient::new(e, &sac.address()),
    )
}

#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let user = Address::generate(&env);
    // let token_address = native_asset_contract_address(&env);
    let (_token_client,sac_client) = create_token_contract(&env,&user);
    let token_address = sac_client.address;  

    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    let crowd_id = 1;
    let name = String::from_str(&env,"test");
    let result = client.create_crowdfunding(&token_address,&user,&crowd_id,&100, &name, &current_time);
    assert_eq!(
        result,
        ()
    );
}
