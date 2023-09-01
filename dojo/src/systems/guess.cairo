#[system]
mod guess_system {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use option::OptionTrait;
    use dojo::world::Context;
    use starknet::get_block_timestamp;
    use dojo_examples::components::{Word, Player, PlayerStatsByDay, PlayerWordAttempts, GameStats};

    const GREEN: u32 = 2;
    const ORANGE: u32 = 1;
    const GRAY: u32 = 0; 

    const BONUS_POINTS: u256 = 100;
    const POINT_UNIT: u256 = 10;

    // TODO: CHECK VALUE
    const ALL_HITS: u32 = 22222;

    fn execute(ctx: Context, attempt: u32) {
        let epoc_day = get_epoc_day();
        let player_stats = get!(ctx.world, (ctx.origin, epoc_day), PlayerStatsByDay);
        assert(player_stats.remaining_tries > 0, 'You have no more attempts!'); 
        assert(player_stats.won == false, 'You already won today!'); 

        let player = get!(ctx.world, ctx.origin, Player);
        let word_of_the_day = get!(ctx.world, epoc_day, Word);
        let attempt_hits = update_player_word_attempts(ctx, player_stats, attempt, word_of_the_day.characters);

        if attempt_hits == ALL_HITS {
            if player_stats.remaining_tries == 5 {
                update_player_points(ctx, player, BONUS_POINTS + POINT_UNIT * player_stats.remaining_tries.into());
            } else {
                update_player_points(ctx, player, POINT_UNIT * player_stats.remaining_tries.into());
            }
            update_player_stats(ctx, player_stats, true);
        } else {
            update_player_stats(ctx, player_stats, false);
        }

        // Register last try
        set!(ctx.world, (Player {
            player: player.player,
            points: player.points,
            last_try: player.last_try
        }));

        return ();
    }

    fn update_player_points(ctx: Context, player: Player, points: u256) {
        set!(ctx.world, (Player {
            player: player.player,
            points: player.points + points,
            last_try: player.last_try
        }));
    }

    fn update_player_stats(ctx: Context, player_stats: PlayerStatsByDay, won: bool) {
        set!(ctx.world, (PlayerStatsByDay {
            player: player_stats.player,
            epoc_day: player_stats.epoc_day,
            won,
            remaining_tries: player_stats.remaining_tries - 1
        }));
    }

    fn update_player_word_attempts(ctx: Context, player_stats: PlayerStatsByDay, player_word: u32, word_of_the_day: u32) -> u32 {
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
            word_attempt: player_word,
            word_hits: hits
        }));

        hits
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

    #[cfg(test)]
    mod tests {
        mod CharactersIntoArray {
            use array::ArrayTrait;
            use traits::{Into, TryInto};
            use option::OptionTrait;
            use dojo_examples::systems::guess::guess_system;

            #[test]
            #[available_gas(2000000)]
            fn giving_word_with_characters_1() {
                let input = 1020304050;
                let mut expected = ArrayTrait::<u32>::new();
                expected.append(10);
                expected.append(20);
                expected.append(30);
                expected.append(40);
                expected.append(50);

                let actual = guess_system::characters_into_array(input);
                assert(*actual.at(0) == *expected.at(0), 'error');
            }
        }
    }
}
