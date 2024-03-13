import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const GET_ASTEROIDS = gql`
  query GetAsteroids {
    asteroidsNear {
      element_count
      near_earth_objects {
        today {
          id
          is_potentially_hazardous_asteroid
        }
      }
    }
  }
`;

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      name
      edad
    }
  }
`;

function ClientsList() {
  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Clientes:</h2>
      <ul>
        {data.clients.map((client, index) => (
          <li key={index}>
            {client.name} - {client.edad}
          </li>
        ))}
      </ul>
    </div>
  );
}




function AsteroidsList() {
  const { loading, error, data } = useQuery(GET_ASTEROIDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
    <div>
      <h2>Asteroides de Hoy:</h2>
      <ul>
        {data.asteroidsNear.near_earth_objects.today.map((asteroide, index) => (
          <li key={index}>
            ID: {asteroide.id} - Potencialmente Peligroso: {asteroide.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}
          </li>
        ))}
      </ul>
    </div>
    
  </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Mi Aplicación GraphQL</h1>
        <AsteroidsList />
        <ClientsList />
      </div>
    </ApolloProvider>
  );
}

export default App;

