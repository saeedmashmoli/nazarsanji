import 'reflect-metadata';
import "dotenv-safe/config";
import express from 'express';
import { ApolloServer   } from 'apollo-server-express';
import { buildSchema  } from 'type-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import http from 'http';
import path from 'path';
import cron from 'node-cron';

// entities
import { User } from './entities/User';
import { Token } from './entities/Token';
import { Type } from './entities/Type';
import { Role } from './entities/Role';
import { Answer } from './entities/Answer';
import { Survey } from './entities/Survey';
import { Question } from './entities/Question';
import { Permission } from './entities/Permission';

// resolvers
import { UserResolver } from './resolvers/user';
import { PermissionRoleResolver } from './resolvers/permissionRole'

// jobs
import { deleteTokensJobs } from './jobs/deleteExpireTokens';
import { QuestionResolver } from './resolvers/question';
import { SurveyResolver } from './resolvers/survey';
import { AnswerResolver } from './resolvers/answer';

const main = async () => {
    // const conn =
        await createConnection({
        type: 'mysql',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname,"./migrations/*.{ts,js}")],
        entities: [User,Token,Role , Permission,Type, Question , Survey , Answer]
    });
    // conn.runMigrations();
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended : true }));
    app.set("trust proxy", 1);
    app.use(cors({
        origin: [process.env.CORS_ORIGIN],
        credentials : true,
    }));
    app.use(cookieParser());

    // run jobs
    cron.schedule('7 12 * * *', async function() {
        await deleteTokensJobs();
        console.log("schedule run jobs")
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
            resolvers: [UserResolver , PermissionRoleResolver , QuestionResolver , SurveyResolver , AnswerResolver],
            validate: false,
        }), 
        context : ({ req , res }) => ({ req , res })
        
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