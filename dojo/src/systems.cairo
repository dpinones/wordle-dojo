#[system]
mod guess {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use starknet::get_block_timestamp;
    use dojo_examples::components::{Word, Player, PlayerStatsByDay, PlayerWordAttempts};

    const GREEN: u32 = 2;
    const ORANGE: u32 = 1;
    const GRAY: u32 = 0; 

    fn execute(ctx: Context, attempt: u32) {
        let epoc_day = get_epoc_day();
        let player_stats = get!(ctx.world, (ctx.origin, epoc_day), PlayerStatsByDay);
        assert(player_stats.remaining_tries > 0, 'You have no more attempts!'); 
        assert(player_stats.won == false, 'You already won today!'); 

        // ir agarrando de a pares y comparar con la palabra del dia
        let word_of_the_day = get!(ctx.world, epoc_day, Word);

        if word_of_the_day.characters == attempt {
            update_player_stats(ctx, player_stats, true);
        } else {
            resolve_attempt_feedback(ctx, player_stats, attempt, word_of_the_day);
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

    fn resolve_attempt_feedback(ctx: Context, player_stats: PlayerStatsByDay, player_word: u32, word_of_the_day: u32) {
        let word_of_the_day_array = characters_into_array(word_of_the_day);
        let player_word_array = characters_into_array(player_word);
        let mut hits = 0;
        let mut i = 0;
        loop {
            if (i == 5) {
                break;
            }
            if player_word_array.at(i) == word_of_the_day_array.at(i)  {
                hits += GREEN * pow(10, i);
            } else if contains_character(@word_of_the_day_array, player_word_array.at(i)) {
                hits += ORANGE * pow(10, i);
            } else {
                hits += GRAY * pow(10, i);
            }
            i += 1;
        };
        
        set!(ctx.world, (PlayerWordAttempts {
            player: player_stats.player,
            epoc_day: player_stats.epoc_day,
            attempt_number: 5 - player_stats.remaining_tries.into(),
            word: player_word,
            word_hits: hits
        }));
    }

    fn contains_character(word_array: @Array<u32>, character: @u32) -> bool {
        let mut i = 0;
        let mut res = false;
        loop {
            if i == word_array.len() - 1 {
                break;
            } 
            if word_array.at(i) == character {
                res = true;
            }
            i += 1;
        };
        res
    }

    fn characters_into_array(word: u32) -> Array<u32> {
        let mut ret = ArrayTrait::<u32>::new();
        let mut iterable = word;
        loop {
            if iterable < 10 {
                ret.append(iterable);
                break;
            }
            ret.append(iterable % 10);
            iterable /= 10; 
        };
        ret
    }

    fn pow(x: u32, n: u32) -> u32 {
        if n == 0 {
            1
        } else if n == 1 {
            x
        } else if (n & 1) == 1 {
            x * pow(x * x, n / 2)
        } else {
            pow(x * x, n / 2)
        }
    }

    fn get_epoc_day() -> u64 {
        get_block_timestamp() / 86400
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

