use array::ArrayTrait;
use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Word {
    #[key]
    epoc_day: u64,
    characters: u32,
    len: u8
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Player {
    #[key]
    player: ContractAddress,
    points: u256,
    last_try: u256
}

// (player, epoc_day) -> value
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct PlayerStatsByDay {
    #[key]
    player: ContractAddress,
    #[key]
    epoc_day: u64,
    won: bool,
    remaining_tries: u8
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct PlayerWordAttempts {
    #[key]
    player: ContractAddress,
    #[key]
    epoc_day: u64,
    #[key]
    attempt_number: u8,
    word_attempt: u32,
    word_hits: u32 
}
// G O B B G has the color of hits in the word 