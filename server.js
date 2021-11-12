//configure port for teh server
const PORT = 5000;

//require express to be used
const express = require('express');

//require express-graphql installed package
const expressGraphQL = require('express-graphql').graphqlHTTP;

//import from GraphQL library to create a query
const {
    GraphQLSchema,          //schema
    GraphQLObjectType,      //object type to create a dynamic object
    GraphQLString,          //GraphQL string object
    GraphQLList,            //GraphQl list object to return a list
    GraphQLInt,             //for integers
    GraphQLNonNull          //prevent returning null values
} = require('graphql');

//call the genereated app by express as server
const server = express();

//placeholder data to act as a mock database
const cooks = [
    {id: 1, name: 'Bert'},
    {id: 2, name: 'Kris'},
    {id: 3, name: 'Mythri'},
    {id: 4, name: 'Abi'}
];

const dishes = [
    {id: 1, name: 'Chicken and Rice', cookId: 1},
    {id: 2, name: 'Fajitas', cookId: 1},
    {id: 3, name: 'Cheese Chip Dip', cookId: 2},
    {id: 4, name: 'Onion Soup', cookId: 2},
    {id: 5, name: 'Thai Curry', cookId: 3},
    {id: 6, name: 'Pumpkin Muffins', cookId: 3},
    {id: 7, name: 'N.Y. Strip Steak', cookId: 4},
    {id: 8, name: 'Mashed Potatoes', cookId: 4}
];

//create a query that returns data for the dishes
const dishType = new GraphQLObjectType({
    name: 'Dish',
    description: 'A dish made by a firend',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        cookId: {type: new GraphQLNonNull(GraphQLInt)},
        cook: {
            type : cookType,
            resolve: (dish) => {
                return cooks.find(cook => cook.id === dish.cookId)  //returns cooks inside of dishes array  
                }
            }
    })
});

//create a query that returns data for cooks
const cookType = new GraphQLObjectType({
    name: 'Cook',
    description: 'Friend who made the dish',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        dishes: {
            type: new GraphQLList(dishType),
            resolve: (cook) => {
                return dishes.filter(dish => dish.cookId === cook.id) //returns an array of the dishes that match both id values
            }
        }
    })
});

//create root query to pull information from placeholder data
const rootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        dish: {
            type: dishType,
            description: 'Single Dish',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => dishes.find(dish => dish.id === args.id)  //
        },

        dishes: {
            type: new GraphQLList(dishType),
            description: 'List Of Dishes Made By Freinds',
            resolve: () => dishes  //returning a list of all dishes
        },
        
        cooks: {
            type: new GraphQLList(cookType),
            description: 'List Of Freinds',
            resolve: () => cooks  //returning a list of all dishes
        },

        cook: {
            type: cookType,
            description: 'Individual Friend',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => cooks.find(cook => cook.id === args.id)
        }
    })
});

//create a new schema
const schema = new GraphQLSchema({
    query: rootQueryType
});





//example practice schema
/*
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
*/

//add root to the application
//at  /graphql
server.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true  //gives  GraphQL UI to acess GraphQL server
}));

//start the server
server.listen(PORT, () => console.log('Server Running on', PORT));