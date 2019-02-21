import {gql} from 'apollo-server-express';

export default gql`
    
    extend type Query {
        user(id:ID!):User
        users:[User!]!
        setsessinfo:User
    }

    extend type Mutation {
        Signup(username:String!,email:String!,password:String!):User
        Signin(email:String!,password:String!):User
        Signout:Boolean
    }

    type User{
        id:ID!,
        username:String!,
        email:String!,
        password:String!,
        createdAt:String!
    }
`;