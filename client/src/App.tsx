import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue } from "@dojoengine/react";
import { Direction, } from './dojo/createSystemCalls'
import { EntityIndex, setComponent } from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import { getComponent, toHexPrefixedString } from './utils';
import { Moves, Position, Player, PlayerStatsByDay, PlayerWordAttempts } from './generated/graphql';

function App() {

  const [player, setPlayer] = useState<Player>({});
  const [turn, setTurn] = useState(0);
  const [word, setWord] = useState('');
  const [stats, setStats] = useState<PlayerStatsByDay>({});
  const [history, setHistory] = useState<Array<PlayerWordAttempts>>([]);

  const {
    setup: {
      systemCalls: { add_word_system, guess },
      network: { graphSdk, call }
    },
    account: { create, list, select, account, isDeploying }
  } = useDojo();

  // entity id - this example uses the account address as the entity id
  const entityId = account.address;

  useEffect(() => {

    if (!entityId) return;

    const fetchData = async () => {
      const { data } = await graphSdk.getEntities();

      if (data && data.entities && data.entities.edges && data.entities.edges.length > 0) {
        console.log('fetchData - data: ', data);

        // setPlayer(getComponent(data.entities?.edges, [entityId]))
        // setStats(getComponent(data.entities?.edges, [entityId, toHexPrefixedString(19603)]))
        
        // let remaining_tries = getComponent(data.entities?.edges, [entityId, toHexPrefixedString(19603)]).remaining_tries;
        // const historial: PlayerWordAttempts[] = [];
        // for (let i = 1; i <= remaining_tries; i++) {
        //   historial.push(getComponent(data.entities?.edges, [entityId, toHexPrefixedString(20230901), toHexPrefixedString(i)]));
        // }
        // setHistory(historial)
        // setTurn(6 - remaining_tries)  
        setWord(getComponent(data.entities?.edges, [toHexPrefixedString(19603)]).characters)
      }
      // console.log('player: ', player)
      // console.log('stats: ', stats)
      // console.log('history: ', history)
      // console.log('turn: ', turn) 
      console.log('word: ', getComponent(data.entities?.edges, [toHexPrefixedString(19603)]))
    }
    fetchData();
  }, [account.address]);

  return (
    <>
      <style>
        {`
          .card {
            padding: 20px;
            margin: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .card-button {
            padding: 10px 20px;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            margin-bottom: 10px;
          }
          .card-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
      <div className="card">
        <button className="card-button" onClick={() => add_word_system(account, 120304050)}>Add Word</button>
        <div>
          <strong>Word:</strong> {word}
        </div>
        <div>
          <strong>Player:</strong> 
          {player ? `${player.points} Points, Last Try: ${player.last_try}` : 'Need to initiate_system'}
        </div>
        <div>
          <strong>Turn:</strong> {turn}
        </div>
        <div>
          <strong>Stats:</strong> 
          {stats ? `Won: ${stats.won}, Remaining Tries: ${stats.remaining_tries}` : 'Need to initiate_system'}
        </div>
        <div>
          <strong>History:</strong>
          <ul>
            {history.map((item, index) => (
              <li key={index}>
                Word Attempt: {item.word_attempt}, Word Hits: {item.word_hits}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <button className="card-button" onClick={() => guess(account)}>Guess</button>
      </div>
    </>
  );
}

export default App;
