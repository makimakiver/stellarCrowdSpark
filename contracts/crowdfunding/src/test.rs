#![cfg(test)]

use core::result;

use super::*;
use soroban_sdk::{vec, Address, Env, Vec};
use token::{StellarAssetClient, TokenClient};
use soroban_sdk::testutils::{Address as _, Ledger};
use soroban_sdk::InvokeError::Abort;


fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let sac = e.register_stellar_asset_contract_v2(admin.clone());
    (
        token::Client::new(e, &sac.address()),
        token::StellarAssetClient::new(e, &sac.address()),
    )
}


fn create_crowdfunding_and_token<'a>(env: &'a Env, current_time: u64, crowd_id: u32, target_price: i128, user: &'a Address, other_users: Vec<Address>)-> (CrowdfundingContractClient<'a>, TokenClient<'a>) {
    let (token_client,sac_client) = create_token_contract(&env,&user);
    let token_address = &sac_client.address;  
    sac_client.mint(&user, &1000000);
    for user in other_users {
        sac_client.mint(&user, &1000000);
    }

    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    let name = String::from_str(&env,"test");
    client.create_crowdfunding(&token_address,&user,&crowd_id, &target_price, &name, &current_time);
    return (client, token_client);
}


#[test]
fn test_init() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let crowd_id = 1;
    create_crowdfunding_and_token(&env,current_time, crowd_id, 100, &owner, Vec::new(&env));
}



#[test]
fn test_init_fails_deadline() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let (_token_client,sac_client) = create_token_contract(&env,&owner);
    let token_address = sac_client.address;  

    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    let crowd_id = 1;
    let name = String::from_str(&env,"test");
    let result = client.try_create_crowdfunding(&token_address,&owner,&crowd_id,&100, &name, &(0));
    assert_eq!(result, Err(Ok(Error::InvalidDeadline)));
}

#[test]
fn test_fail_donate_before_init() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let user = Address::generate(&env);
    let contract_id = env.register_contract(None, CrowdfundingContract);
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    let crowd_id = 1;
    let result = client.try_donate(&user,&100, &crowd_id);
    assert_eq!(result, Err(Err(Abort)));
}


#[test]
fn test_donate() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time, crowd_id,100,&owner, Vec::from_array(&env, [user.clone()]));
    assert!(token_client.balance(&user) == 1000000);
    let result = client.donate(&user,&100, &crowd_id);
    assert_eq!(result, 100);
    assert!(token_client.balance(&user) == 999900);
}



#[test]
fn test_fail_donate_owner() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time, crowd_id,100,&owner, Vec::new(&env));
    assert!(token_client.balance(&owner) == 1000000);
    let result = client.try_donate(&owner,&100, &crowd_id);
    assert_eq!(result, Err(Ok(Error::OwnerCannotDonate)));
}

#[test]
fn test_two_donation() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let user2 = Address::generate(&env);
    let other_users = Vec::from_array(&env, [user.clone(),user2.clone()]);
    let crowd_id = 1;
    let (client,_) = create_crowdfunding_and_token(&env,current_time + 1, crowd_id, 100, &owner,other_users);
    client.donate(&user,&100, &crowd_id);
    client.donate(&user2,&100, &crowd_id);
    let balance = client.get_balance(&crowd_id);
    assert_eq!(balance, 200);
    let contribution1 = client.get_contribution(&crowd_id, &user);
    assert_eq!(contribution1, 100);
    let contribution2 = client.get_contribution(&crowd_id, &user2);
    assert_eq!(contribution2, 100);
}


#[test]
fn test_multiple_donations_same_user(){
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time+10, crowd_id, 100 ,&owner,  Vec::from_array(&env, [user.clone()]) );
    assert!(token_client.balance(&user) == 1000000);
    client.donate(&user,&50, &crowd_id);
    assert!(token_client.balance(&user) == 999950);
    let contribution1 = client.get_contribution(&crowd_id, &user);
    assert_eq!(contribution1, 50);
    client.donate(&user,&40, &crowd_id);
    assert!(token_client.balance(&user) == 999910);
    let contribution1 = client.get_contribution(&crowd_id, &user);
    assert_eq!(contribution1, 90);
    assert_eq!(client.get_balance(&crowd_id), 90);
}

#[test]
fn test_donate_fail_after_deadline() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let crowd_id  = 1;
    let (client,_) = create_crowdfunding_and_token(&env,current_time+10, crowd_id,100,&owner,  Vec::from_array(&env, [user.clone()]));
    client.donate(&user,&100, &crowd_id);
    env.ledger().with_mut(|li| {
        li.timestamp = current_time + 100;
    });
    let result = client.try_donate(&user,&100, &crowd_id);
    assert_eq!(result, Err(Ok(Error::CrowfundingAlreadyClosed)));
}

#[test]
fn test_withdraw_fail_before_deadline() {
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let crowd_id = 1;
    let (client,_) = create_crowdfunding_and_token(&env,current_time+10, crowd_id, 100 ,&owner,  Vec::from_array(&env, [user.clone()]));
    client.donate(&user,&105, &crowd_id);
    let result = client.try_withdraw_funds(&crowd_id);
    assert_eq!(result, Err(Ok(Error::CrowfundingStillOpen)));
}

#[test]
fn test_withdraw_not_target_price_1_user(){
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time+10, crowd_id, 100 ,&owner,  Vec::from_array(&env, [user.clone()]));
    assert!(token_client.balance(&user) == 1000000);
    client.donate(&user,&50, &crowd_id);
    assert!(token_client.balance(&user) == 999950);
    env.ledger().with_mut(|li| {
        li.timestamp = current_time + 100;
    });
    client.withdraw_funds(&crowd_id);
    assert!(token_client.balance(&user) == 1000000);
    let balance = client.get_balance(&crowd_id);
    assert_eq!(balance, 0);
}


#[test]
fn test_withdraw_not_target_price_3_user(){
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);
    let other_users = Vec::from_array(&env, [user.clone(),user2.clone(), user3.clone()]);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time+10, crowd_id, 100 ,&owner,other_users);
    assert!(token_client.balance(&user) == 1000000);
    assert!(token_client.balance(&user2) == 1000000);
    assert!(token_client.balance(&user3) == 1000000);
    client.donate(&user,&50, &crowd_id);
    client.donate(&user2,&10, &crowd_id);
    client.donate(&user3,&15, &crowd_id);
    assert!(token_client.balance(&user) == 999950);
    assert!(token_client.balance(&user2) == 999990);
    assert!(token_client.balance(&user3) == 999985);
    env.ledger().with_mut(|li| {
        li.timestamp = current_time + 100;
    });
    client.withdraw_funds(&crowd_id);
    assert!(token_client.balance(&user) == 1000000);
    assert!(token_client.balance(&user2) == 1000000);
    assert!(token_client.balance(&user3) == 1000000);
    let balance = client.get_balance(&crowd_id);
    assert_eq!(balance, 0);
}

#[test]
fn test_withdraw_target_price(){
    let env = Env::default();
    env.mock_all_auths();
    let current_time = 12345;
    env.ledger().with_mut(|li| {
        li.timestamp = current_time;
    });
    let owner = Address::generate(&env);
    let user = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);
    let other_users = Vec::from_array(&env, [user.clone(),user2.clone(), user3.clone()]);
    let crowd_id = 1;
    let (client,token_client) = create_crowdfunding_and_token(&env,current_time+10, crowd_id, 100 ,&owner, other_users);
    assert!(token_client.balance(&user) == 1000000);
    assert!(token_client.balance(&user2) == 1000000);
    assert!(token_client.balance(&user3) == 1000000);
    client.donate(&user,&90, &crowd_id);
    client.donate(&user2,&10, &crowd_id);
    client.donate(&user3,&100, &crowd_id);
    assert!(client.get_balance(&crowd_id) == 200);
    env.ledger().with_mut(|li| {
        li.timestamp = current_time + 100;
    });
    client.withdraw_funds(&crowd_id);
    assert!(token_client.balance(&owner) == 1000000 + 200);
    let balance = client.get_balance(&crowd_id);
    assert_eq!(balance, 0);
}

