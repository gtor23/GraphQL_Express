//configure port for teh server
const PORT = 5000;

//require express to be used
const express = require('express');

//require express-graphql installed package
const expressGraphQL = require('express-graphql').graphqlHTTP;

//import from GraphQL library to create a query
const {
    GraphQLSchema,    //schema
    GraphQLObjectType,   //object type to create a dynamic object
    GraphQLString       //GraphQL string object
} = require('graphql');

//call the genereated app by express as server
const server = express();

//create a new schema
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: {
                type: GraphQLString, //type of message will be a string
                resolve: () => 'Hello World' //use resolve section of the function to create a function that returns 'Hello World'
            }
        })
    })
});

//add root to the application
//at  /graphql
server.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true  //gives  GraphQL UI to acess GraphQL server
}));

//start the server
server.listen(PORT, () => console.log('Server Running on', PORT));