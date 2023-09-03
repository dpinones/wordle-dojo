#[system]
mod ranking_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Player, Ranking};
    use starknet::ContractAddress;

    fn execute(ctx: Context, player_address: ContractAddress) {
        let replaced_ranking = try_override_rank(ctx, player_address);

        if replaced_ranking.is_some() {
            reorder_ranking(replaced_ranking.unwrap(), player_address)
        }

        return ();
    }

    fn reorder_ranking(replaced_ranking: Ranking, player_address: ContractAddress) {
        
    }

    fn reorder_ranking_internal(idx: u64, replaced_ranking: Ranking, player_address: ContractAddress) {

    }
    
    fn try_override_rank(ctx: Context, player_address: ContractAddress) -> Option<Ranking> {
        let player = get!(ctx.world, player_address, Player);
        override_rank_player_internal(1, ctx, player)
    }

    fn override_rank_player_internal(idx: u64, ctx: Context, player: Player) -> Option<Ranking> {
        if idx > 20 {
            return Option::<Ranking>::None(());
        }
        let rank_idx = get!(ctx.world, idx, Ranking);
        if rank_idx.points < player.points {
            // Override player rank
            set!(
                ctx.world,
                (Ranking {
                    rank_number: idx, address: player.player,  points: player.points
                })
            );
            return Option::<Ranking>::Some(rank_idx);
        }
        override_rank_player_internal(idx + 1, ctx, player)
    }
}
