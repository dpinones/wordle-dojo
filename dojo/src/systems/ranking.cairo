#[system]
mod ranking_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{PlayerStats, Ranking};

    fn execute(ctx: Context) {
        let mut i = 1;
        let mut ex_index = 0;
        let mut ex_player_points = 0;
        let mut ex_player_address = 0;

        let player_rank = get!(ctx.world, ctx.origin, PlayerStats);
        loop {
            if (i == 10) {
                break;
            }
            let rank_i = get!(ctx.world, i, Ranking);
            if player_rank.points >= rank_i.points {
                ex_index = i;
                ex_player_points = rank_i.points;
                ex_player_address = rank_i.player;

                set!(
                    ctx.world,
                    (Ranking {
                        player: player_rank.player, rank_number: i, points: player_rank.points
                    })
                );
                break;
            }
            i += 1;
        }

        // re-order players
        if ex_index != 0 {
            loop {
                if ex_index == 10 {
                    break;
                }
                let ex_rank_i = get!(ctx.world, ex_index, Ranking);
                set!(
                    ctx.world,
                    (Ranking {
                        player: ex_player_address, rank_number: ex_index, points: ex_player_points
                    })
                );
                ex_player_address = ex_rank_i.player;
                ex_player_points = ex_rank_i.points;
                ex_index += 1;
            }
        }
        return ();
    }
}
