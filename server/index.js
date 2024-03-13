import { createServer } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';
import fetch from "node-fetch";

import cors  from 'cors';
import express from 'express';

const app = express();



app.use(cors('http://127.0.0.1:5173/'))

let clients  = [

{
    name: 'Peter',
    
},
{
    name: 'Jane',
    edad: 45
},
{
    name: 'Lauren',
    edad: 60
},


]

//tenemos una query que se llama clients que nos devuelve un objeto de tipo Client(mayus como las interfaces)
//y ese tipo Client tiene una propiedad de nombre String

const typeDefinitions = `
type Query { 
  clients: [Client],
  asteroidsNear : AsteroidsNear
},
type Mutation {
    addClient(name : String, edad: String) : Client
},
type Client {
  name: String,
  edad: String
},
type AsteroidsNear {
    element_count: Int,
    near_earth_objects: NearEarthObjects,
    links: Links
},
type Links {
    next: String,
    prev: String,
    self: String
},
type MissDistance {
    astronomical: String
    lunar: String
    kilometers: String
    miles: String
  },
  
  type RelativeVelocity {
    kilometers_per_second: String
    kilometers_per_hour: String
    miles_per_hour: String
  },
  
  type CloseApproachData {
    close_approach_date: String
    close_approach_date_full: String
    epoch_date_close_approach: Int
    orbiting_body: String
    miss_distance: MissDistance
    relative_velocity: RelativeVelocity
  },
  
  type Feet {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  },
  
  type Miles {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  },
  
  type Meters {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  },
  
  type Kilometers {
    estimated_diameter_min: Float
    estimated_diameter_max: Float
  },
  
  type EstimatedDiameter {
    feet: Feet
    miles: Miles
    meters: Meters
    kilometers: Kilometers
  },
  
  type Today {
    id: String
    neo_reference_id: String
    name: String
    nasa_jpl_url: String
    absolute_magnitude_h: Float
    is_potentially_hazardous_asteroid: Boolean
    is_sentry_object: Boolean
    close_approach_data: [CloseApproachData]
    estimated_diameter: EstimatedDiameter
    links: Links
  },
  
  type NearEarthObjects {
    today: [Today]
  }
`;

// Query hace solo llamadas de lectura al servidor 
// Mutation similar a la sentencia de sql update q nos permite escribir adentro de la DB
//llamada de escritura MUTATION
//agregar cliente a traves de una mutation 

const resolvers = {
    Query: {
      clients : () => {
          return clients;
      },
      asteroidsNear : async () => {
        
        let res = await fetch(
          'https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-05-10&end_date=2022-05-10&api_key=DEMO_KEY'
        );

        res = await res.text();
        res = res.replaceAll("2022-05-10" , "today");
        res = JSON.parse(res);
        return res;

      }
    },
    Mutation : {
        addClient : (_, data)=> {
            let newClient = {
                'name' : data.name,
                'edad' : data.edad
            };
            clients.push(newClient);
            return newClient;
        }
    }
  }

//devuelve los clients


const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefinitions ,
    resolvers: resolvers
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})