import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,
        Position: overridableComponent(contractComponents.Position),
        Moves: overridableComponent(contractComponents.Moves),
        GameStats: overridableComponent(contractComponents.GameStats),
        Word: overridableComponent(contractComponents.Word),
        Player: overridableComponent(contractComponents.Player),
        PlayerStatsByDay: overridableComponent(contractComponents.PlayerStatsByDay),
        PlayerWordAttempts: overridableComponent(contractComponents.PlayerWordAttempts),
    };
}