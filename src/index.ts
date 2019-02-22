import {ApolloServer} from 'apollo-server-express';
import {Express} from 'express';
const expre = require('express');
import session from 'express-session';
import MongoStore from 'connect-mongo';
import resolvers from './resolvers';
import typeDefs from './types';
import cookierparser from 'cookie-parser';
import { Request } from 'apollo-server-env';

export default class Server{

    app!: Express;
    server:ApolloServer;
    store: any;

    constructor(){
        this.app = new expre();
        this.app.disable('x-powered-by');
        this.initializeSessionStore();
        this.app.use(function(req, res, next) {  
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
          });
        this.app.use(cookierparser());
        this.app.use(session({
            name:`graphql-session`, 
            secret:`life`,
            resave:false,
            saveUninitialized:false,
            cookie:{
                maxAge:720000,
                sameSite:true,
                secure:false
            },
            store:this.store
        }));
        this.server = new ApolloServer({
            typeDefs,
            resolvers,
            introspection: true,
            playground :true,
            context: (req:Request,res:Response) => ({
                req,res
            })
        });
        this.server.applyMiddleware({app:this.app});
    }


    startServer(){
        this.app.listen({port:4000},()=>{
            console.log(`🚀 Server ready at http://localhost:4000${this.server.graphqlPath}`)
        })
    }

    initializeSessionStore(){
        const mongostore = MongoStore(session);
        this.store = new mongostore({
            url: 'mongodb://localhost/mygraphapi',
            ttl:720000
          });
    }
}

const serverObj = new Server();
serverObj.startServer();