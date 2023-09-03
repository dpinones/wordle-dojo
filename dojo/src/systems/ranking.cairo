#[system]
mod ranking_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Player, Ranking};
    use starknet::ContractAddress; 

    const LAST_RANK_POSITION: u32 = 10;

    fn execute(ctx: Context, player_address: ContractAddress) {
        let replaced_ranking = try_write_rank(ctx, player_address);

        if replaced_ranking.is_some() {
            reorder_ranking(ctx, replaced_ranking.unwrap(), player_address)
        }

        return ();
    }

    fn reorder_ranking(ctx: Context, replaced_ranking: Ranking, player_address: ContractAddress) {
        reorder_ranking_internal(ctx, replaced_ranking.rank_number + 1, replaced_ranking, player_address)
    }

    // Apply bubble-sort
    fn reorder_ranking_internal(ctx: Context, idx: u64, replaced_ranking: Ranking, player_address: ContractAddress) {
        let mut array = ArrayTrait::<Ranking>::new();

        // populate array with actual ranking
        let mut idx: u32 = 1;
        loop {
             if idx > LAST_RANK_POSITION {
                break;
            }
            let rank = get!(ctx.world, idx, Ranking);
            array.append(rank);
            idx += 1;
        };
        let mut idx1 = 0;
        let mut idx2 = 1;
        let mut sorted_iteration = 0;
        let mut sorted_array = ArrayTrait::<Ranking>::new();
        
        loop {
            if idx2 == array.len() {
                sorted_array.append(*array[idx1]);
                if sorted_iteration == 0 {
                    break;
                }
                array = sorted_array;
                sorted_array = array![];
                idx1 = 0;
                idx2 = 1;
                sorted_iteration = 0;
            } else {
                let points_idx1 = *(array.at(idx1)).points;
                let points_idx2 = *(array.at(idx2)).points;
                if points_idx1 < points_idx2 {
                    sorted_array.append(*array[idx1]);
                    idx1 = idx2;
                    idx2 += 1;
                } else {
                    sorted_array.append(*array[idx2]);
                    idx2 += 1;
                    sorted_iteration = 1;
                }
            };
        };

        // write new ranking
        let mut idx: u32 = 1;
        loop {
            if idx == LAST_RANK_POSITION {
                break;
            }
            set!(
                ctx.world,
                (Ranking {
                    rank_number: idx.into(), address: *(sorted_array.at(idx)).address,  points: *(sorted_array.at(idx)).points
                })
            );
            idx += 1; 
        };
    }

    fn try_write_rank(ctx: Context, player_address: ContractAddress) -> Option<Ranking> {
        let player = get!(ctx.world, player_address, Player);
        try_write_rank_internal(1, ctx, player)
    }

    fn try_write_rank_internal(idx: u32, ctx: Context, player: Player) -> Option<Ranking> {
        if idx == LAST_RANK_POSITION {
            let rank_idx = get!(ctx.world, idx, Ranking);
            if player.points > rank_idx.points  {
                // remove last position and override
                set!(
                    ctx.world,
                    (Ranking {
                        rank_number: idx.into(), address: player.player,  points: player.points
                    })
                );
                return Option::<Ranking>::Some(rank_idx);
            } else {
                return Option::<Ranking>::None(());
            }
        }
        let rank_idx = get!(ctx.world, idx, Ranking);
        if rank_idx.address == player.player { 
            // overrides own score
            set!(
                ctx.world,
                (Ranking {
                    rank_number: idx.into(), address: player.player,  points: player.points
                })
            );
            return Option::<Ranking>::Some(rank_idx);
        }
        try_write_rank_internal(idx + 1, ctx, player)
    }
}
