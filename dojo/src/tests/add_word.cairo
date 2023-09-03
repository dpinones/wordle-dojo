#[cfg(test)]
mod AddWordTest {
    // dojo core imports
    use starknet::ContractAddress;
    use core::traits::Into;
    use array::{Span, ArrayTrait, SpanTrait};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::spawn_test_world;

    use dojo_examples::components::{word, Word};
    use dojo_examples::components::{game_stats, GameStats};

    use dojo_examples::systems::add_word::add_word_system;

    use debug::PrintTrait;
    const WORDLE_DOJO_ID: u32 = 1;

    // helper setup function
    // reuse this function for all tests
    fn setup_world() -> IWorldDispatcher {
        // components
        let mut components = array![game_stats::TEST_CLASS_HASH, word::TEST_CLASS_HASH];

        // systems
        let mut systems = array![add_word_system::TEST_CLASS_HASH];

        // deploy executor, world and register components/systems
        spawn_test_world(components, systems)
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
