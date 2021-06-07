const { ApolloServer, gql } = require('apollo-server');
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    user: "postgres",
    password: "postgres",
    database: "guripat"
  }
});

const typeDefs = gql`

  type Item {
    id: Int
    quantity: Int
    name: String
    bought: Boolean
    perishable: String
  }


  type Query {
    getItems: [Item]
  }

  type Mutation {
    createItem(quantity: Int!, name: String!): Item
    updateItemQuantity(id: Int!, quantity: Int!): Item
    updateItemBought(id: Int!, bought: Boolean!): Item
    updateItemPerishable(id: Int!, perishable: String!): Item
  }
`;


const resolvers = {
  Mutation: {
    createItem: async (_, {quantity, name}) => {
      const bought = false
      const perishable = "non perishable"
      const item = await knex("items")
      .insert({ quantity, name, bought, perishable})
      .returning("*")

      return item[0]
    },

    updateItemQuantity: async(_,{id, quantity}) => {
      const item = await knex("items")
      .where('id', id)
      .update('quantity', quantity)
      .returning("*")

      return item[0]

    },

    updateItemBought: async(_,{id, bought}) => {
      const item = await knex("items")
      .where('id', id)
      .update('bought', bought)
      .returning("*")
  

      return item[0]
  
    },

    updateItemPerishable: async(_,{id, perishable}) => {
      const item = await knex("items")
      .where('id', id)
      .update('perishable', perishable)
      .returning("*")
  
 
      return item[0]
  
    }



},
    Query: {
      getItems: () => knex("items").select("*"),
    },
  };
  

const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
