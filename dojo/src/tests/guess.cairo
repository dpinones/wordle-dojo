#[cfg(test)]
mod GuessSystemTest {
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
        let mut systems = array![guess_system::TEST_CLASS_HASH, add_word_system::TEST_CLASS_HASH];

        // deploy executor, world and register components/systems
        spawn_test_world(components, systems)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_guess_player_guesses_the_word() { 
    // starknet::testing::set_block_timestamp(2_u64); // didnt work :(
    // // This should be 2
    // let epoc_day = 0;

    // let world = setup_world();

    // // Add word
    // world.execute('add_word_system', array![1010101010]);

    // // Player guesses correctly
    // world.execute('guess_system', array![1010101010]);

    // // call data for entity - it is just the caller
    // let caller = starknet::contract_address_const::<0x0>();
    // let call_data = array![caller.into()].span();

    // let player = world.entity('Player', call_data, 0, dojo::SerdeLen::<Player>::len());
    // // Player guess in first try, so points should be 160 (100 bonus + 10 * remaining tries)
    // let points = *player[0];
    // let p2 = *player[1];
    // 'points'.print();
    // points.print();
    // p2.print();
    // assert(*player[0] == 160, 'wrong points');
    // // Last try should be changed
    // // TODO: For now its just 0                
    // assert(*player[1] == epoc_day, 'wrong last try');

    // let call_data = array![caller.into(), epoc_day].span();
    // let player_stats = world.entity('PlayerStats', call_data, 0, dojo::SerdeLen::<PlayerStats>::len());

    // // Player won today, so with key (address, epoc) -> won should be true
    // assert(*player_stats[0] == 1, 'wrong won');
    // // He use 1 of 6 tries, so, result should be 5
    // assert(*player_stats[1] == 5, 'wrong remaining tries');

    }
}

#[cfg(test)]
mod ContainsCharacterTest {
    use array::ArrayTrait;
    use dojo_examples::systems::guess::guess_system;

    #[test]
    #[available_gas(2000000)]
    fn giving_a_character_and_word_that_contains_should_return_true() {
        let input = array![10, 20, 30, 40, 50];

        assert(guess_system::contains_character(@input, 10) == true, 'ContainsCharacter error');
        assert(guess_system::contains_character(@input, 20) == true, 'ContainsCharacter error');
        assert(guess_system::contains_character(@input, 30) == true, 'ContainsCharacter error');
        assert(guess_system::contains_character(@input, 40) == true, 'ContainsCharacter error');
        assert(guess_system::contains_character(@input, 50) == true, 'ContainsCharacter error');
    }

    #[test]
    #[available_gas(2000000)]
    fn giving_a_character_and_word_that_doest_contains_should_return_false() {
        let input = array![10, 20, 30, 40, 50];

        assert(guess_system::contains_character(@input, 11) == false, 'ContainsCharacter error');
        assert(guess_system::contains_character(@input, 4) == false, 'ContainsCharacter error');
    }
}

#[cfg(test)]
mod CharactersIntoArrayTest {
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
    #[available_gas(2000000)]
    #[should_panic(expected: ('wrong word len!',))]
    fn giving_word_with_all_zeros() {
        let input = 0000000000;
        guess_system::characters_into_array(input);
    }

    #[test]
    #[should_panic]
    fn giving_an_incomplete_word_should_panic() {
        let input = 22010502;
        guess_system::characters_into_array(input);
    }
}
