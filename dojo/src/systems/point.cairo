
#[system]
mod point_system {
    use array::ArrayTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{PlayerStats, Ranking};

    fn execute(ctx: Context, points: u64) {
        let player = get!(ctx.world, ctx.origin, Player);
        set!(
            ctx.world,
            (Player {
                player: player.player, points: points, last_try: player.last_try
            })
        );
        
        return ();
    }
}

