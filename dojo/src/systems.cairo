#[system]
mod guess {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use starknet::get_block_timestamp;

    use dojo_examples::components::{Word, Player, PlayerStatsByDay, PlayerWordAttempts};

    // TODO: revisar epoc
    fn execute(ctx: Context, attempt: u32) {
        
        let epoc_day = calculate_epoc();
        // validar que el jugador en ese dia tenga intentos
        let player_stats = get!(ctx.world, (ctx.origin, epoc_day), PlayerStatsByDay);
        assert(player_stats.remaining_tries > 0, ''); 
        assert(player_stats.won == false, ''); 


        // ir agarrando de a pares y comparar con la palabra del dia
        let word_of_the_day = get!(ctx.world, epoc_day, Word);

        if word_of_the_day.characters == attempt {
            update_player_stats(ctx, player_stats, true);
        } else {
            update_player_stats(ctx, player_stats, false);
        }
        return ();
    }

    fn update_player_stats(ctx: Context, player_stats: PlayerStatsByDay, won: bool) {
        set!(ctx.world, (PlayerStatsByDay {
            player: player_stats.player,
            epoc_day: player_stats.epoc_day,
            won,
            remaining_tries: player_stats.remaining_tries - 1
        }));
    }

    fn calculate_epoc() -> u64 {
        get_block_timestamp()
    }
}

#[system]
mod initiate_system {

    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;

    use dojo_examples::components::{Word, Player, PlayerStatsByDay, PlayerWordAttempts};

    fn execute(ctx: Context) {
        set!(ctx.world, (Word {
            epoc_day: 1,
            characters: 11111,
            len: 5
        }));

        set!(ctx.world, (Word {
            epoc_day: 2,
            characters: 22222,
            len: 5
        }));
    }
}

