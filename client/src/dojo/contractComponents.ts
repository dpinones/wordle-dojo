/* Autogenerated file. Do not edit manually. */

import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Moves: (() => {
      const name = "Moves";
      return defineComponent(
        world,
        {
          remaining: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Position: (() => {
      const name = "Position";
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    GameStats: (() => {
      const name = "GameStats";
      return defineComponent(
        world,
        {
          next_word_position: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Word: (() => {
      const name = "Word";
      return defineComponent(
        world,
        {
          characters: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    Player: (() => {
      const name = "Player";
      return defineComponent(
        world,
        {
          points: RecsType.Number,
          last_try: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    PlayerStatsByDay: (() => {
      const name = "PlayerStatsByDay";
      return defineComponent(
        world,
        {
          won: RecsType.Boolean,
          remaining_tries: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    PlayerWordAttempts: (() => {
      const name = "PlayerWordAttempts";
      return defineComponent(
        world,
        {
          word_attempt: RecsType.Number,
          word_hits: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    AuthStatus: (() => {
      const name = "AuthStatus";
      return defineComponent(
        world,
        {
          is_authorized: RecsType.Boolean,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
    AuthRole: (() => {
      const name = "AuthRole";
      return defineComponent(
        world,
        {
          id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
  };
}
