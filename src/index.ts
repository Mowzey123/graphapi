import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import resolvers from './resolvers';
import typeDefs from './types';


export default class Server{

    app =  express();
    server:ApolloServer;
    store: any;

    constructor(){
        this.app.disable('x-powered-by');
        this.initializeSessionStore();
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
            context: (req: Request,res: Response) => {
                return ({ req, res });
            }
        });
        this.server.applyMiddleware({app:this.app});
    }


    startServer(){
        this.app.listen({port:4000},()=>{
            console.log(`App is listening on port 4000 ${this.server.graphqlPath}`);
        })
    }

    initializeSessionStore(){
        const mongostore = MongoStore(session);
        this.store = new mongostore({
            url: 'mongodb://localhost/mygraphapi',
            ttl: 14 * 24 * 60 * 60 // = 14 days. Default
          });
    }
}

const serverObj = new Server();
serverObj.startServer();