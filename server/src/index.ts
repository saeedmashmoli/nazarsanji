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
import { graphqlUploadExpress } from 'graphql-upload'
import {pagination} from 'typeorm-pagination';

// entities
import { User } from './entities/User';
import { Token } from './entities/Token';
import { Type } from './entities/Type';
import { Role } from './entities/Role';
import { Answer } from './entities/Answer';
import { Survey } from './entities/Survey';
import { Question } from './entities/Question';
import { Permission } from './entities/Permission';
import { PermissionRole } from './entities/PermissionRole';
import { Customer } from './entities/Customer';
import { Call } from './entities/Call';
import { Package } from './entities/Package';

// resolvers
import { UserResolver } from './resolvers/user';
import { PermissionRoleResolver } from './resolvers/permissionRole';
import { QuestionResolver } from './resolvers/question';
import { SurveyResolver } from './resolvers/survey';
import { AnswerResolver } from './resolvers/answer';
import { CallResolver } from './resolvers/call';
import { CustomerResolver } from './resolvers/customer';
import { PackageResolver } from './resolvers/package';

// jobs
import { deleteTokensJobs } from './jobs/deleteExpireTokens';




const main = async () => {

    // const conn =
        await createConnection({
        type: 'mysql',
        url: process.env.DATABASE_URL,
        logging: true,
        // synchronize: true,
        migrations: [path.join(__dirname,"./migrations/*.{ts,js}")],
        entities: [
            User,
            Token,
            Role, 
            Permission,
            Type, 
            Question, 
            Survey, 
            Answer,
            PermissionRole,
            Customer,
            Call,
            Package
        ]
    });
    // conn.runMigrations();
    const app = express();
    app.use('/static', express.static(path.join(__dirname, 'static')))
    app.use(bodyParser.json());
    app.use('/graphql',graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
    app.use(bodyParser.urlencoded({ extended : true }));
    app.set("trust proxy", 1);
    app.use(cors({
        origin: [process.env.CORS_ORIGIN],
        credentials : true,
    }));
    app.use(cookieParser());
    app.use(pagination)
    // run jobs
    cron.schedule('7 12 * * *', async function() {
        await deleteTokensJobs();
    });


    const apolloServer = new ApolloServer({
        uploads : false,
        // subscriptions : {
        //     path:"/subscriptions",
        //     onConnect(){
        //         console.log("connected to websocket")
        //     },
        //     onDisconnect : () => console.log('Disconnected to websocket'),
        // },
        schema : await buildSchema({
            resolvers: [
                UserResolver, 
                PermissionRoleResolver,
                QuestionResolver,
                SurveyResolver,
                AnswerResolver,
                CallResolver,
                CustomerResolver,
                PackageResolver
            ],
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