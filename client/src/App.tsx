import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue } from "@dojoengine/react";
import { EntityIndex, setComponent } from '@latticexyz/recs';
import { useEffect } from 'react';
import { getFirstComponentByType } from './utils';
import { Word, Player, PlayerStatsByDay, PlayerWordAttempts } from './generated/graphql';

// import game
import '@fontsource/fascinate-inline';
import '@fontsource/clear-sans';
import '@fontsource/clear-sans/700.css';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './game/theme';
import Main from './game/components/Main';

function App() {
  const {
    setup: {
      systemCalls: { initiate_system, guess },
      components: { Word, Player, PlayerStatsByDay, PlayerWordAttempts },
      network: { graphSdk, call }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  // entity id - this example uses the account address as the entity id
  const entityId = account.address;

  // get current component values
  // const position = useComponentValue(Position, parseInt(entityId.toString()) as EntityIndex);
  // const moves = useComponentValue(Moves, parseInt(entityId.toString()) as EntityIndex);
  const word = useComponentValue(Word, parseInt(entityId.toString()) as EntityIndex);
  const player = useComponentValue(Player, parseInt(entityId.toString()) as EntityIndex);
  const playerStatsByDay = useComponentValue(PlayerStatsByDay, parseInt(entityId.toString()) as EntityIndex);
  const playerWordAttempts = useComponentValue(PlayerWordAttempts, parseInt(entityId.toString()) as EntityIndex);

  useEffect(() => {

    if (!entityId) return;

    const fetchData = async () => {
      const { data } = await graphSdk.getEntities();

      if (data) {
        // let remaining = getFirstComponentByType(data.entities?.edges, 'Moves') as Moves;
        // let position = getFirstComponentByType(data.entities?.edges, 'Position') as Position;
        
        let data_word = getFirstComponentByType(data.entities?.edges, 'Word') as Word;
        // let data_player = getFirstComponentByType(data.entities?.edges, 'Player') as Player;
        // let data_playerStatsByDay = getFirstComponentByType(data.entities?.edges, 'PlayerStatsByDay') as PlayerStatsByDay;
        // let data_playerWordAttempts = getFirstComponentByType(data.entities?.edges, 'PlayerWordAttempts') as PlayerWordAttempts;

        // setComponent(Moves, parseInt(entityId.toString()) as EntityIndex, { remaining: remaining.remaining })
        // setComponent(Position, parseInt(entityId.toString()) as EntityIndex, { x: position.x, y: position.y })
        
        setComponent(Word, parseInt(entityId.toString()) as EntityIndex, { characters: data_word.characters, len: data_word.len })
        // setComponent(Player, parseInt(entityId.toString()) as EntityIndex, { points: data_player.points, last_try: data_player.last_try })
        // setComponent(PlayerStatsByDay, parseInt(entityId.toString()) as EntityIndex, { won: data_playerStatsByDay.won, remaining_tries: data_playerStatsByDay.remaining_tries })
        // setComponent(PlayerWordAttempts, parseInt(entityId.toString()) as EntityIndex, { word_attempt: data_playerWordAttempts.word_attempt, word_hits: data_playerWordAttempts.word_hits })
      }
    }
    fetchData();
  }, [word]);


  return (
    <>
      {/* <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
      <div className="card">
        select signer:{" "}
        <select onChange={e => select(e.target.value)}>
          {list().map((account, index) => {
            return <option value={account.address} key={index}>{account.address}</option>
          })}
        </select>
      </div>
      <div className="card">
        <button onClick={() => spawn(account)}>Spawn</button>
        <div>Moves Left: {moves ? `${moves['remaining']}` : 'Need to Spawn'}</div>
        <div>Position: {position ? `${position['x']}, ${position['y']}` : 'Need to Spawn'}</div>
      </div>
      <div className="card">
        <button onClick={() => move(account, Direction.Up)}>Move Up</button> <br />
        <button onClick={() => move(account, Direction.Left)}>Move Left</button>
        <button onClick={() => move(account, Direction.Right)}>Move Right</button> <br />
        <button onClick={() => move(account, Direction.Down)}>Move Down</button>
      </div> */}

      <div className="card">
        <button onClick={() => initiate_system(account)}>Initiate</button>
        <div>Word: {word ? `${word['characters']}, ${word['len']}` : 'Need to Spawn'}</div>
      </div>
      <ChakraProvider theme={theme}>
        <Main />
      </ChakraProvider>
    </>
  );
}

export default App;
