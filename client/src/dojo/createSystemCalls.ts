import { SetupNetworkResult } from "./setupNetwork";
import { Account, InvokeTransactionReceiptResponse, shortString } from "starknet";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Word, Player, PlayerStatsByDay, PlayerWordAttempts }: ClientComponents
) {

    const initiate_system = async (signer: Account) => {

        // const entityId = parseInt(signer.address) as EntityIndex;

        // const positionId = uuid();
        // Position.addOverride(positionId, {
        //     entity: entityId,
        //     value: updatePositionWithDirection(direction, getComponentValue(Position, entityId) as Position),
        // });

        // const movesId = uuid();
        // Moves.addOverride(movesId, {
        //     entity: entityId,
        //     value: { remaining: (getComponentValue(Moves, entityId)?.remaining || 0) - 1 },
        // });

        try {
            const tx = await execute(signer, "initiate_system", []);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            const events = parseEvent(receipt)
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            // const movesEvent = events[0] as Moves;
            // setComponent(contractComponents.Moves, entity, { remaining: movesEvent.remaining })

            // const positionEvent = events[1] as Position;
            // setComponent(contractComponents.Position, entity, { x: positionEvent.x, y: positionEvent.y })

            const wordEvent = events[0] as Word;
            setComponent(contractComponents.Word, entity, { characters: wordEvent.characters , len: wordEvent.len })
        } catch (e) {
            console.log(e)
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    const guess = async (signer: Account, attempt: number) => {

        // const entityId = parseInt(signer.address) as EntityIndex;

        // const positionId = uuid();
        // Position.addOverride(positionId, {
        //     entity: entityId,
        //     value: updatePositionWithDirection(direction, getComponentValue(Position, entityId) as Position),
        // });

        // const movesId = uuid();
        // Moves.addOverride(movesId, {
        //     entity: entityId,
        //     value: { remaining: (getComponentValue(Moves, entityId)?.remaining || 0) - 1 },
        // });

        try {
            const tx = await execute(signer, "move", [attempt]);

            console.log(tx)
            const receipt = await signer.waitForTransaction(tx.transaction_hash, { retryInterval: 100 })

            console.log(receipt)

            const events = parseEvent(receipt)
            const entity = parseInt(events[0].entity.toString()) as EntityIndex

            // const movesEvent = events[0] as Moves;
            // setComponent(contractComponents.Moves, entity, { remaining: movesEvent.remaining })

            // const positionEvent = events[1] as Position;
            // setComponent(contractComponents.Position, entity, { x: positionEvent.x, y: positionEvent.y })
        } catch (e) {
            // console.log(e)
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }

    };

    return {
        initiate_system,
        guess
    };
}


// TODO: Move types and generalise this

export enum ComponentEvents {
    Word = "Word",
    Player = "Player",
    PlayerStatsByDay = "PlayerStatsByDay",
    PlayerWordAttempts = "PlayerWordAttempts",
}

export interface BaseEvent {
    type: ComponentEvents;
    entity: string;
}

export interface Word extends BaseEvent {
    characters: number;
    len: number;
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
): Array<Word | Player | PlayerStatsByDay | PlayerWordAttempts> => {
    if (!receipt.events) {
        throw new Error(`No events found`);
    }

    let events: Array<Word | Player | PlayerStatsByDay | PlayerWordAttempts> = [];

    for (let raw of receipt.events) {
        const decodedEventType = shortString.decodeShortString(raw.data[0]);

        switch (decodedEventType) {
            case ComponentEvents.Word:
                if (raw.data.length < 7) {
                    throw new Error('Insufficient data for Word event.');
                }

                const wordData: Word = {
                    type: ComponentEvents.Word,
                    entity: raw.data[2],
                    characters: Number(raw.data[5]),
                    len: Number(raw.data[6]),
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