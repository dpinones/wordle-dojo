import { SetupNetworkResult } from "./setupNetwork";
import { Account, InvokeTransactionReceiptResponse, shortString } from "starknet";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { updatePositionWithDirection } from "../utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
) {
    const add_word_system = async (signer: Account, word: number) => {

        try {
            const tx = await execute(signer, "add_word_system", [word]);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

        } catch (e) {
            console.log(e)
        }
    };

    const guess = async (signer: Account, attempt: number) => {
        try {
            const tx = await execute(signer, "guess_system", [attempt]);
            console.log(tx)
            await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })
        } catch (e) {
            console.log(e)
        }
    };

    return {
        add_word_system,
        guess
    };
}


// TODO: Move types and generalise this

export enum Direction {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}

export enum ComponentEvents {
    Moves = "Moves",
    Position = "Position",
    GameStats = "GameStats",
    Word = "Word",
    Player = "Player",
    PlayerStatsByDay = "PlayerStatsByDay",
    PlayerWordAttempts = "PlayerWordAttempts",
}

export interface BaseEvent {
    type: ComponentEvents;
    entity: string;
}

export interface Moves extends BaseEvent {
    remaining: number;
}

export interface Position extends BaseEvent {
    x: number;
    y: number;
}

export interface GameStats extends BaseEvent {
    next_word_position: number;
}

export interface Word extends BaseEvent {
    characters: number;
}

export interface Player extends BaseEvent {
    points: number;
    last_try: number;
}

export interface PlayerStatsByDay extends BaseEvent {
    won: boolean;
    remaining_tries: number;
}

export interface PlayerWordAttempts extends BaseEvent {
    word_attempt: number;
    word_hits: number;
}

export const parseEvent = (
    receipt: InvokeTransactionReceiptResponse
): Array<Moves | Position | GameStats | Word | Player | PlayerStatsByDay | PlayerWordAttempts> => {
    if (!receipt.events) {
        throw new Error(`No events found`);
    }

    let events: Array<Moves | Position | GameStats | Word | Player | PlayerStatsByDay | PlayerWordAttempts> = [];

    for (let raw of receipt.events) {
        const decodedEventType = shortString.decodeShortString(raw.data[0]);

        switch (decodedEventType) {
            case ComponentEvents.Moves:
                if (raw.data.length < 6) {
                    throw new Error('Insufficient data for Moves event.');
                }

                const movesData: Moves = {
                    type: ComponentEvents.Moves,
                    entity: raw.data[2],
                    remaining: Number(raw.data[5]),
                };

                events.push(movesData);
                break;

            case ComponentEvents.Position:
                if (raw.data.length < 7) {
                    throw new Error('Insufficient data for Position event.');
                }

                const positionData: Position = {
                    type: ComponentEvents.Position,
                    entity: raw.data[2],
                    x: Number(raw.data[5]),
                    y: Number(raw.data[6]),
                };

                events.push(positionData);
                break;

            case ComponentEvents.GameStats:
                if (raw.data.length < 6) {
                    throw new Error('Insufficient data for Word event.');
                }

                const gameStatsData: GameStats = {
                    type: ComponentEvents.GameStats,
                    entity: raw.data[2],
                    next_word_position: Number(raw.data[5]),
                };

                events.push(gameStatsData);
                break;

            case ComponentEvents.Word:
                if (raw.data.length < 6) {
                    throw new Error('Insufficient data for Word event.');
                }

                const wordData: Word = {
                    type: ComponentEvents.Word,
                    entity: raw.data[2],
                    characters: Number(raw.data[5]),
                };

                events.push(wordData);
                break;

            case ComponentEvents.Player:
                if (raw.data.length < 7) {
                    throw new Error('Insufficient data for Player event.');
                }

                const playerData: Player = {
                    type: ComponentEvents.Player,
                    entity: raw.data[2],
                    points: Number(raw.data[5]),
                    last_try: Number(raw.data[6]),
                };

                events.push(playerData);
                break;

            case ComponentEvents.PlayerStatsByDay:
                if (raw.data.length < 7) {
                    throw new Error('Insufficient data for PlayerStatsByDay event.');
                }

                const playerStatsByDayData: PlayerStatsByDay = {
                    type: ComponentEvents.PlayerStatsByDay,
                    entity: raw.data[2],
                    won: Boolean(raw.data[5]),
                    remaining_tries: Number(raw.data[6]),
                };

                events.push(playerStatsByDayData);
                break;

            case ComponentEvents.PlayerWordAttempts:
                        if (raw.data.length < 7) {
                            throw new Error('Insufficient data for Position event.');
                        }
        
                        const playerWordAttemptsData: PlayerWordAttempts = {
                            type: ComponentEvents.PlayerWordAttempts,
                            entity: raw.data[2],
                            word_attempt: Number(raw.data[5]),
                            word_hits: Number(raw.data[6]),
                        };
        
                        events.push(playerWordAttemptsData);
                        break;

            default:
                throw new Error('Unsupported event type.');
        }
    }

    return events;
};