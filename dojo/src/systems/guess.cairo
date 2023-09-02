#[system]
mod guess_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use starknet::get_block_timestamp;
    use dojo_examples::components::{Word, Player, PlayerStats, PlayerWordAttempts, GameStats};
    use debug::PrintTrait;

    const GREEN: u32 = 2;
    const ORANGE: u32 = 1;
    const GRAY: u32 = 0;

    const BONUS_POINTS: u256 = 100;
    const POINT_UNIT: u256 = 10;

    // TODO: CHECK VALUE
    const ALL_HITS: u32 = 22222;
    const TOTAL_DAILY_TRIES: u8 = 6;
    const WORDS_LEN: u32 = 5;

    fn execute(ctx: Context, attempt: u32) {
        let epoc_day = get_epoc_day();
        let player_stats = get!(ctx.world, (ctx.origin, epoc_day), PlayerStats);
        let player = get!(ctx.world, ctx.origin, Player);

        // reset player stats if doesnt play today yet
        reset_player_stats(ctx, player_stats, player, epoc_day);

        // assert(player_stats.remaining_tries > 0, 'You have no more attempts!');
        assert(player_stats.won == false, 'You already won today!');

        let word_of_the_day = get!(ctx.world, epoc_day, Word);
        let attempt_hits = update_player_word_attempts(
            ctx, player_stats, attempt, word_of_the_day.characters
        );

        if attempt_hits == ALL_HITS {
            'ALL_HITS'.print();
            'remaining'.print();
            player_stats.remaining_tries.print();
            
            if player_stats.remaining_tries == TOTAL_DAILY_TRIES {
                update_player_points(
                    ctx, player, BONUS_POINTS + POINT_UNIT * player_stats.remaining_tries.into()
                );
            } else {
                update_player_points(ctx, player, POINT_UNIT * player_stats.remaining_tries.into());
            }
            update_player_stats(ctx, player_stats, true);
        } else {
            update_player_stats(ctx, player_stats, false);
        }

        // Set last try to today 
        set!(
            ctx.world, (Player { player: player.player, points: player.points, last_try: epoc_day })
        );

        return ();
    }

    fn reset_player_stats(ctx: Context, player_stats: PlayerStats, player: Player, epoc_day: u64) {
        // since epoc always return 0
        // if epoc_day != player.last_try {
            set!(
                ctx.world,
                (PlayerStats {
                    player: player_stats.player,
                    epoc_day: player_stats.epoc_day,
                    won: false,
                    remaining_tries: 6
                })
            );
        // }
        return ();
    }

    fn update_player_points(ctx: Context, player: Player, points: u256) {
        set!(
            ctx.world,
            (Player {
                player: player.player, points: player.points + points, last_try: player.last_try
            })
        );
    }

    fn update_player_stats(ctx: Context, player_stats: PlayerStats, won: bool) {
        set!(
            ctx.world,
            (PlayerStats {
                player: player_stats.player,
                epoc_day: player_stats.epoc_day,
                won,
                remaining_tries: player_stats.remaining_tries - 1
            })
        );
    }

    fn update_player_word_attempts(
        ctx: Context, player_stats: PlayerStats, player_word: u32, word_of_the_day: u32
    ) -> u32 {
        let word_of_the_day_array = characters_into_array(word_of_the_day);
        let player_word_array = characters_into_array(player_word);
        let mut hits = 0;
        let mut i = 0;
        loop {
            if (i == 5) {
                break;
            }
            if player_word_array.at(i) == word_of_the_day_array.at(i) {
                hits += GREEN * pow(10, i);
            } else if contains_character(@word_of_the_day_array, *player_word_array.at(i)) {
                hits += ORANGE * pow(10, i);
            } else {
                hits += GRAY * pow(10, i);
            }
            i += 1;
        };

        set!(
            ctx.world,
            (PlayerWordAttempts {
                player: player_stats.player,
                epoc_day: player_stats.epoc_day,
                attempt_number: TOTAL_DAILY_TRIES - player_stats.remaining_tries.into(),
                word_attempt: player_word,
                word_hits: hits
            })
        );
        hits
    }

    fn contains_character(word_array: @Array<u32>, character: u32) -> bool {
        let mut i = 0;
        let mut res = false;
        loop {
            if i == word_array.len() {
                break;
            }
            if *word_array.at(i) == character {
                res = true;
            }
            i += 1;
        };
        res
    }

    fn characters_into_array(word: u32) -> Array<u32> {
        let mut ret = ArrayTrait::<u32>::new();
        let mut iterable = word;
        loop {
            if iterable < 10 {
                break;
            }
            let last_digit = iterable % 10;
            let penultimate_digit = (iterable / 10) % 10;
            ret.append(penultimate_digit * 10 + last_digit);
            iterable /= 100;
        };

        if iterable > 0 {
            ret.append(iterable);
        }
        assert(ret.len() == WORDS_LEN, 'wrong word len!');
        revert(ret)
    }

    fn revert(array: Array<u32>) -> Array<u32> {
        let mut res = ArrayTrait::<u32>::new();
        let mut i = array.len() - 1;
        loop {
            res.append(*array.at(i));
            if i == 0 {
                break;
            }
            i -= 1;
        };
        res
    }

    fn pow(x: u32, n: u32) -> u32 {
        if n == 0 {
            1
        } else if n == 1 {
            x
        } else if (n & 1) == 1 {
            x * pow(x * x, n / 2)
        } else {
            pow(x * x, n / 2)
        }
    }

    fn get_epoc_day() -> u64 {
        get_block_timestamp() / 86400
    }

    #[cfg(test)]
    mod tests {
        mod GuessSystem {
            // dojo core imports
            use starknet::ContractAddress;
            use core::traits::Into;
            use array::{Span, ArrayTrait, SpanTrait};
            use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
            use dojo::test_utils::spawn_test_world;

            use dojo_examples::components::{game_stats, GameStats};
            use dojo_examples::components::{player_stats, PlayerStats};
            use dojo_examples::components::{player, Player};
            use dojo_examples::components::{word, Word};

            use dojo_examples::systems::guess::guess_system;
            use dojo_examples::systems::add_word::add_word_system;

            use debug::PrintTrait;
            const WORDLE_DOJO_ID: u32 = 1;

            // helper setup function
            // reuse this function for all tests
            fn setup_world() -> IWorldDispatcher {
                // components
                let mut components = array![
                    game_stats::TEST_CLASS_HASH,
                    player_stats::TEST_CLASS_HASH,
                    player::TEST_CLASS_HASH,
                    word::TEST_CLASS_HASH
                ];

                // systems
                let mut systems = array![
                    guess_system::TEST_CLASS_HASH, add_word_system::TEST_CLASS_HASH
                ];

                // deploy executor, world and register components/systems
                spawn_test_world(components, systems)
            }

            #[test]
            #[available_gas(30000000)]
            fn test_guess_player_guesses_the_word() {
                let world = setup_world();
                world.execute('add_word_system', array![1010101010]);
                world.execute('guess_system', array![1010101010]);
            }

            #[test]
            #[available_gas(30000000)]
            fn test_add_word() {
                let world = setup_world();
                world.execute('add_word_system', array![1010101010]);

                let call_data = array![0].span();
                let words = world.entity('Word', call_data, 0, dojo::SerdeLen::<Word>::len());

                assert(*words[0] == 1010101010, 'wrong word');

                let call_data = array![WORDLE_DOJO_ID.into()].span();
                let game_stats = world
                    .entity('GameStats', call_data, 0, dojo::SerdeLen::<GameStats>::len());

                assert(*game_stats[0] == 1, 'next_word_position');
            }
        }

        mod ContainsCharacter {
            use array::ArrayTrait;
            use dojo_examples::systems::guess::guess_system;

            #[test]
            #[available_gas(2000000)]
            fn giving_a_character_and_word_that_contains_should_return_true() {
                let input = array![10, 20, 30, 40, 50];

                assert(
                    guess_system::contains_character(@input, 10) == true, 'ContainsCharacter error'
                );
                assert(
                    guess_system::contains_character(@input, 20) == true, 'ContainsCharacter error'
                );
                assert(
                    guess_system::contains_character(@input, 30) == true, 'ContainsCharacter error'
                );
                assert(
                    guess_system::contains_character(@input, 40) == true, 'ContainsCharacter error'
                );
                assert(
                    guess_system::contains_character(@input, 50) == true, 'ContainsCharacter error'
                );
            }

            #[test]
            #[available_gas(2000000)]
            fn giving_a_character_and_word_that_doest_contains_should_return_false() {
                let input = array![10, 20, 30, 40, 50];

                assert(
                    guess_system::contains_character(@input, 11) == false, 'ContainsCharacter error'
                );
                assert(
                    guess_system::contains_character(@input, 4) == false, 'ContainsCharacter error'
                );
            }
        }

        mod CharactersIntoArray {
            use array::ArrayTrait;
            use dojo_examples::systems::guess::guess_system;

            #[test]
            #[available_gas(2000000)]
            fn giving_word_with_all_characters_gt_10() {
                let input = 1020304050;
                let expected = array![10, 20, 30, 40, 50];

                let actual = guess_system::characters_into_array(input);

                assert(*actual[0] == *expected[0], 'CharactersIntoArray error');
                assert(*actual[1] == *expected[1], 'CharactersIntoArray error');
                assert(*actual[2] == *expected[2], 'CharactersIntoArray error');
                assert(*actual[3] == *expected[3], 'CharactersIntoArray error');
                assert(*actual[4] == *expected[4], 'CharactersIntoArray error');
                assert(actual.len() == 5, 'error');
            }

            #[test]
            #[available_gas(2000000)]
            fn giving_word_with_first_character_lt_10() {
                let input = 722040521;
                let expected = array![7, 22, 4, 5, 21];

                let actual = guess_system::characters_into_array(input);

                assert(*actual[0] == *expected[0], 'CharactersIntoArray error');
                assert(*actual[1] == *expected[1], 'CharactersIntoArray error');
                assert(*actual[2] == *expected[2], 'CharactersIntoArray error');
                assert(*actual[3] == *expected[3], 'CharactersIntoArray error');
                assert(*actual[4] == *expected[4], 'CharactersIntoArray error');
                assert(actual.len() == 5, 'error');
            }

            #[test]
            #[available_gas(2000000)]
            fn giving_word_with_all_characters_lt_10() {
                let input = 709010502;
                let expected = array![7, 9, 1, 5, 2];

                let actual = guess_system::characters_into_array(input);

                assert(*actual[0] == *expected[0], 'CharactersIntoArray error');
                assert(*actual[1] == *expected[1], 'CharactersIntoArray error');
                assert(*actual[2] == *expected[2], 'CharactersIntoArray error');
                assert(*actual[3] == *expected[3], 'CharactersIntoArray error');
                assert(*actual[4] == *expected[4], 'CharactersIntoArray error');
                assert(actual.len() == 5, 'error');
            }

            #[test]
            #[should_panic]
            fn giving_an_incomplete_word_should_panic() {
                let input = 22010502;
                guess_system::characters_into_array(input);
            }
        }
    }
}
