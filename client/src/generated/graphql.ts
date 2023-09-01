import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u8: { input: any; output: any; }
  u32: { input: any; output: any; }
  u256: { input: any; output: any; }
};

export type ComponentUnion = Player | PlayerStatsByDay | PlayerWordAttempts | Word;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']['output']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Event>;
};

export type Player = {
  __typename?: 'Player';
  entity?: Maybe<Entity>;
  last_try?: Maybe<Scalars['u256']['output']>;
  points?: Maybe<Scalars['u256']['output']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: Direction;
  field: PlayerOrderOrderField;
};

export enum PlayerOrderOrderField {
  LastTry = 'LAST_TRY',
  Points = 'POINTS'
}

export type PlayerStatsByDay = {
  __typename?: 'PlayerStatsByDay';
  entity?: Maybe<Entity>;
  remaining_tries?: Maybe<Scalars['u8']['output']>;
  won?: Maybe<Scalars['bool']['output']>;
};

export type PlayerStatsByDayConnection = {
  __typename?: 'PlayerStatsByDayConnection';
  edges?: Maybe<Array<Maybe<PlayerStatsByDayEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type PlayerStatsByDayEdge = {
  __typename?: 'PlayerStatsByDayEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<PlayerStatsByDay>;
};

export type PlayerStatsByDayOrder = {
  direction: Direction;
  field: PlayerStatsByDayOrderOrderField;
};

export enum PlayerStatsByDayOrderOrderField {
  RemainingTries = 'REMAINING_TRIES',
  Won = 'WON'
}

export type PlayerStatsByDayWhereInput = {
  remaining_tries?: InputMaybe<Scalars['Int']['input']>;
  remaining_triesGT?: InputMaybe<Scalars['Int']['input']>;
  remaining_triesGTE?: InputMaybe<Scalars['Int']['input']>;
  remaining_triesLT?: InputMaybe<Scalars['Int']['input']>;
  remaining_triesLTE?: InputMaybe<Scalars['Int']['input']>;
  remaining_triesNEQ?: InputMaybe<Scalars['Int']['input']>;
  won?: InputMaybe<Scalars['Int']['input']>;
  wonGT?: InputMaybe<Scalars['Int']['input']>;
  wonGTE?: InputMaybe<Scalars['Int']['input']>;
  wonLT?: InputMaybe<Scalars['Int']['input']>;
  wonLTE?: InputMaybe<Scalars['Int']['input']>;
  wonNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type PlayerWhereInput = {
  last_try?: InputMaybe<Scalars['String']['input']>;
  last_tryGT?: InputMaybe<Scalars['String']['input']>;
  last_tryGTE?: InputMaybe<Scalars['String']['input']>;
  last_tryLT?: InputMaybe<Scalars['String']['input']>;
  last_tryLTE?: InputMaybe<Scalars['String']['input']>;
  last_tryNEQ?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
  pointsGT?: InputMaybe<Scalars['String']['input']>;
  pointsGTE?: InputMaybe<Scalars['String']['input']>;
  pointsLT?: InputMaybe<Scalars['String']['input']>;
  pointsLTE?: InputMaybe<Scalars['String']['input']>;
  pointsNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type PlayerWordAttempts = {
  __typename?: 'PlayerWordAttempts';
  entity?: Maybe<Entity>;
  word_attempt?: Maybe<Scalars['u32']['output']>;
  word_hits?: Maybe<Scalars['u32']['output']>;
};

export type PlayerWordAttemptsConnection = {
  __typename?: 'PlayerWordAttemptsConnection';
  edges?: Maybe<Array<Maybe<PlayerWordAttemptsEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type PlayerWordAttemptsEdge = {
  __typename?: 'PlayerWordAttemptsEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<PlayerWordAttempts>;
};

export type PlayerWordAttemptsOrder = {
  direction: Direction;
  field: PlayerWordAttemptsOrderOrderField;
};

export enum PlayerWordAttemptsOrderOrderField {
  WordAttempt = 'WORD_ATTEMPT',
  WordHits = 'WORD_HITS'
}

export type PlayerWordAttemptsWhereInput = {
  word_attempt?: InputMaybe<Scalars['Int']['input']>;
  word_attemptGT?: InputMaybe<Scalars['Int']['input']>;
  word_attemptGTE?: InputMaybe<Scalars['Int']['input']>;
  word_attemptLT?: InputMaybe<Scalars['Int']['input']>;
  word_attemptLTE?: InputMaybe<Scalars['Int']['input']>;
  word_attemptNEQ?: InputMaybe<Scalars['Int']['input']>;
  word_hits?: InputMaybe<Scalars['Int']['input']>;
  word_hitsGT?: InputMaybe<Scalars['Int']['input']>;
  word_hitsGTE?: InputMaybe<Scalars['Int']['input']>;
  word_hitsLT?: InputMaybe<Scalars['Int']['input']>;
  word_hitsLTE?: InputMaybe<Scalars['Int']['input']>;
  word_hitsNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  playerComponents?: Maybe<PlayerConnection>;
  playerstatsbydayComponents?: Maybe<PlayerStatsByDayConnection>;
  playerwordattemptsComponents?: Maybe<PlayerWordAttemptsConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  wordComponents?: Maybe<WordConnection>;
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlayerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type QueryPlayerstatsbydayComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerStatsByDayOrder>;
  where?: InputMaybe<PlayerStatsByDayWhereInput>;
};


export type QueryPlayerwordattemptsComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerWordAttemptsOrder>;
  where?: InputMaybe<PlayerWordAttemptsWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int']['input'];
};


export type QueryWordComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
  where?: InputMaybe<WordWhereInput>;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  systemId?: Maybe<Scalars['ID']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<System>;
};

export type Word = {
  __typename?: 'Word';
  characters?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<Entity>;
  len?: Maybe<Scalars['u8']['output']>;
};

export type WordConnection = {
  __typename?: 'WordConnection';
  edges?: Maybe<Array<Maybe<WordEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type WordEdge = {
  __typename?: 'WordEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Word>;
};

export type WordOrder = {
  direction: Direction;
  field: WordOrderOrderField;
};

export enum WordOrderOrderField {
  Characters = 'CHARACTERS',
  Len = 'LEN'
}

export type WordWhereInput = {
  characters?: InputMaybe<Scalars['Int']['input']>;
  charactersGT?: InputMaybe<Scalars['Int']['input']>;
  charactersGTE?: InputMaybe<Scalars['Int']['input']>;
  charactersLT?: InputMaybe<Scalars['Int']['input']>;
  charactersLTE?: InputMaybe<Scalars['Int']['input']>;
  charactersNEQ?: InputMaybe<Scalars['Int']['input']>;
  len?: InputMaybe<Scalars['Int']['input']>;
  lenGT?: InputMaybe<Scalars['Int']['input']>;
  lenGTE?: InputMaybe<Scalars['Int']['input']>;
  lenLT?: InputMaybe<Scalars['Int']['input']>;
  lenLTE?: InputMaybe<Scalars['Int']['input']>;
  lenNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'Player', points?: any | null, last_try?: any | null } | { __typename: 'PlayerStatsByDay', won?: any | null, remaining_tries?: any | null } | { __typename: 'PlayerWordAttempts', word_attempt?: any | null, word_hits?: any | null } | { __typename: 'Word', characters?: any | null, len?: any | null } | null> | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["%"]) {
    edges {
      node {
        keys
        components {
          __typename
          ... on Word {
            characters
            len
          }
          ... on Player {
            points
            last_try
          }
          ... on PlayerStatsByDay {
            won
            remaining_tries
          }
          ... on PlayerWordAttempts {
            word_attempt
            word_hits
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;