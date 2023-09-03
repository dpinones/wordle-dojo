#[cfg(test)]
mod RankingTest {
    // dojo core imports
    use starknet::ContractAddress;
    use core::traits::Into;
    use array::{Span, ArrayTrait, SpanTrait};
    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::spawn_test_world;

    use dojo_examples::components::{ranking, Ranking};
    use dojo_examples::components::{player_stats, PlayerStats};

    use dojo_examples::systems::ranking::ranking_system;

    use debug::PrintTrait;

    // helper setup function
    // reuse this function for all tests
    fn setup_world() -> IWorldDispatcher {
        let mut components = array![player_stats::TEST_CLASS_HASH, ranking::TEST_CLASS_HASH,];

        let mut systems = array![ranking_system::TEST_CLASS_HASH];

        spawn_test_world(components, systems)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_first_player_ranking() {
        // TODO: add tests
        assert(1 == 1, '')
    }
}
