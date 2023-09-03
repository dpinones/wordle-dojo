#[system]
mod add_word_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Word, GameStats};

    const WORDLE_DOJO_ID: u32 = 1;

    fn execute(ctx: Context, word: u32) {
        let game_stats = get!(ctx.world, WORDLE_DOJO_ID, GameStats);
        let epoc_day = starknet::get_block_timestamp() / 86400;

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
mod add_words_system {
    use array::ArrayTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;

    fn execute(ctx: Context, words: Array<u32>) {
        let mut i = 0;
        loop {
            if i == words.len() {
                break;
            }
            let word_call_data = *words[i];
            ctx.world.execute('add_word_system', array![word_call_data.into()]);
            i += 1;
        };
        return ();
    }
}

