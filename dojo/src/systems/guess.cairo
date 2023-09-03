#[system]
mod guess_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use dojo_examples::components::{Word, Player, PlayerStats, PlayerWordAttempts, GameStats};
    use debug::PrintTrait;

    const GREEN: u32 = 3;
    const YELLOW: u32 = 2;
    const GRAY: u32 = 1;

    const BONUS_POINTS: u64 = 100;
    const POINT_UNIT: u64 = 10;

    // TODO: CHECK VALUE
    const ALL_HITS: u32 = 33333;
    const TOTAL_DAILY_TRIES: u8 = 6;
    const WORDS_LEN: u32 = 5;

    fn execute(ctx: Context, attempt: u32) {
        let epoc_day = starknet::get_block_timestamp() / 86400;
        let mut player_stats = get!(ctx.world, (ctx.origin, epoc_day), PlayerStats);
        let player = get!(ctx.world, ctx.origin, Player);

        // init player stats if doesnt play today yet   
        player_stats = try_init_player_stats(ctx, @player_stats, player.last_try, epoc_day);

        assert(player_stats.remaining_tries > 0, 'You have no more attempts!');
        assert(player_stats.won == false, 'You already won today!');

        let word_of_the_day = get!(ctx.world, epoc_day, Word);
        let attempt_hits = update_player_word_attempts(
            ctx, player_stats, attempt, word_of_the_day.characters
        );

        let mut player_won = false;
        if attempt_hits == ALL_HITS {
            let mut points: u64 = if player_stats.remaining_tries == TOTAL_DAILY_TRIES {
                BONUS_POINTS + POINT_UNIT * player_stats.remaining_tries.into()
            } else {
                 POINT_UNIT * player_stats.remaining_tries.into()
            };
            ctx.world.execute('point_system', array![points.into()]);
            // ctx.world.execute('ranking_system', array![ctx.origin.into()]);
            player_won = true;
        }
        
        update_player_stats(ctx, player_stats, player_won);

        // Set last try to today 
        set!(
            ctx.world, (Player { player: player.player, points: player.points, last_try: epoc_day })
        );

        return ();
    }

    fn try_init_player_stats(
        ctx: Context, player_stats: @PlayerStats, player_last_try: u64, epoc_day: u64
    ) -> PlayerStats {
        if epoc_day > player_last_try {
            set!(
                ctx.world,
                (PlayerStats {
                    player: *player_stats.player,
                    epoc_day: *player_stats.epoc_day,
                    won: false,
                    remaining_tries: TOTAL_DAILY_TRIES
                })
            );

            PlayerStats {
                player: *player_stats.player,
                epoc_day: *player_stats.epoc_day,
                won: false,  
                remaining_tries: TOTAL_DAILY_TRIES
            }
        } else { 
            *player_stats
        }
    }

    fn update_player_stats(ctx: Context, player_stats: PlayerStats, won: bool) {
        set!(
            ctx.world,
            (PlayerStats {
                player: player_stats.player,
                epoc_day: player_stats.epoc_day,
                won,
                remaining_tries: player_stats.remaining_tries - 1
            })
        );
    }

    fn update_player_word_attempts(
        ctx: Context, player_stats: PlayerStats, player_word: u32, word_of_the_day: u32
    ) -> u32 {
        let word_of_the_day_array = characters_into_array(word_of_the_day);
        let player_word_array = characters_into_array(player_word);
        let mut hits = 0;
        let mut i = 0;
        loop {
            if (i == WORDS_LEN) {
                break;
            }
            if player_word_array.at(i) == word_of_the_day_array.at(i) {
                hits += GREEN * pow(10, WORDS_LEN - i - 1);
            } else if contains_character(@word_of_the_day_array, *player_word_array.at(i)) {
                hits += YELLOW * pow(10, WORDS_LEN - i - 1);
            } else {
                hits += GRAY * pow(10, WORDS_LEN - i - 1);
            }
            i += 1;
        };

        set!(
            ctx.world,
            (PlayerWordAttempts {
                player: player_stats.player,
                epoc_day: player_stats.epoc_day,
                attempt_number: TOTAL_DAILY_TRIES - player_stats.remaining_tries.into(),
                word_attempt: player_word,
                word_hits: hits
            })
        );
        hits
    }

    fn contains_character(word_array: @Array<u32>, character: u32) -> bool {
        let mut i = 0;
        let mut res = false;
        loop {
            if i == word_array.len() {
                break;
            }
            if *word_array.at(i) == character {
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
                break;
            }
            let last_digit = iterable % 10;
            let penultimate_digit = (iterable / 10) % 10;
            ret.append(penultimate_digit * 10 + last_digit);
            iterable /= 100;
        };

        if iterable > 0 {
            ret.append(iterable);
        }
        assert(ret.len() == WORDS_LEN, 'wrong word len!');
        revert(ret)
    }

    fn revert(array: Array<u32>) -> Array<u32> {
        let mut res = ArrayTrait::<u32>::new();
        let mut i = array.len() - 1;
        loop {
            res.append(*array.at(i));
            if i == 0 {
                break;
            }
            i -= 1;
        };
        res
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
}
