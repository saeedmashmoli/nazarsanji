import 'reflect-metadata';
import "dotenv-safe/config";
import express from 'express';
import { ApolloServer   } from 'apollo-server-express';
import { buildSchema  } from 'type-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import http from 'http';
import path from 'path';
import cron from 'node-cron';

// entities
import { User } from './entities/User';
import { Token } from './entities/Token';

// resolvers
import { UserResolver } from './resolvers/user';

const main = async () => {
    // const conn =
        await createConnection({
        type: 'mysql',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname,"./migrations/*")],
        entities: [User,Token]
    });
    // conn.runMigrations();
    const app = express();
    app.set("trust proxy", 1);
    app.use(cors({
        origin: [process.env.CORS_ORIGIN],
        credentials : true,
    }));
    app.use(cookieParser());

    cron.schedule('33 0 * * *', function() {
        console.log("running schedule")
    });


    const apolloServer = new ApolloServer({
        // subscriptions : {
        //     path:"/subscriptions",
        //     onConnect(){
        //         console.log("connected to websocket")
        //     },
        //     onDisconnect : () => console.log('Disconnected to websocket'),
        // },
        schema : await buildSchema({
            resolvers: [UserResolver],
            validate: false,
        }), 
        context : ({ req , res }) => {
            // const accessToken = req.cookies["access-token"];
            // if(accessToken){
            //     const data = verify(accessToken, process.env.TOKEN_PRIVATE_KEY) as any;
            //     (req as any).userId = data.userId;
            // }
            return { req , res }
        }
    })
    apolloServer.applyMiddleware({ app , cors : false});
    const httpServer = http.createServer(app);
    // apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(process.env.PORT,() => {
        console.log(`server is running on port ${process.env.PORT}`)
    })
}
main().catch(err => {
    console.log(err)
})