#[system]
mod add_word_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Word, GameStats, Epoc};
    use starknet::get_block_timestamp;
    use debug::PrintTrait;

    const WORDLE_DOJO_ID: u32 = 1;

    fn execute(ctx: Context, word: u32) {
        let game_stats = get!(ctx.world, WORDLE_DOJO_ID, GameStats);
        let epoc_day = get_block_timestamp() / 86400;

        // TODO: REMOVE 
        set!(
            ctx.world,
            (Epoc { i: 1 , epoc: epoc_day})
        );

        set!(
            ctx.world,
            (Word { epoc_day: epoc_day + game_stats.next_word_position.into(), characters: word })
        );

        set!(
            ctx.world,
            (GameStats {
                id: WORDLE_DOJO_ID, next_word_position: game_stats.next_word_position + 1
            })
        );

        return ();
    }
}

#[system]
mod add_words {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Word, GameStats};
    use starknet::get_block_timestamp;

    const WORDLE_DOJO_ID: u32 = 1;

    fn execute(ctx: Context, words: Array<u32>) {
        let game_stats = get!(ctx.world, WORDLE_DOJO_ID, GameStats);
        let epoc_day = get_block_timestamp() / 86400;
        let mut next_word_position_plus_epoc_day = epoc_day + game_stats.next_word_position.into();
        let mut i = 0;
        loop {
            if i == words.len() - 1 {
                break;
            }
            set!(
                ctx.world,
                (Word { epoc_day: next_word_position_plus_epoc_day, characters: *words.at(i), })
            );
            i += 1;
            next_word_position_plus_epoc_day += 1;
        };

        set!(
            ctx.world,
            (GameStats {
                id: WORDLE_DOJO_ID,
                next_word_position: next_word_position_plus_epoc_day.try_into().unwrap(),
            })
        );
    }
}

