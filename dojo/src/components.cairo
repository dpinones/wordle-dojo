use array::ArrayTrait;
use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct GameStats {
    #[key]
    id: u32,
    next_word_position: u32,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Word {
    #[key]
    epoc_day: u64,
    characters: u32,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Player {
    #[key]
    player: ContractAddress,
    points: u64,
    last_try: u64
}

// (player, epoc_day) -> value
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct PlayerStats {
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

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Ranking {
    #[key]
    rank_number: u64,
    address: ContractAddress,
    points: u64,
}
