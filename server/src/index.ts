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
import { Parameter } from './entities/Parameter';
import { Template } from './entities/Template';
import { ParameterTemplate } from './entities/ParameterTemplate';
import { CallPackage } from './entities/CallPackage';
import { Sms } from './entities/Sms';
import { Log } from './entities/Log';
import { Model } from './entities/Model';
import { Comment } from './entities/Comment';
import { Criteria } from './entities/Criteria';
import { Condition } from './entities/Condition';

// resolvers
import { UserResolver } from './resolvers/user';
import { RoleResolver } from './resolvers/role';
import { PermissionResolver } from './resolvers/permission';
import { QuestionResolver } from './resolvers/question';
import { SurveyResolver } from './resolvers/survey';
import { AnswerResolver } from './resolvers/answer';
import { CallResolver } from './resolvers/call';
import { CustomerResolver } from './resolvers/customer';
import { PackageResolver } from './resolvers/package';
import { SmsResolver } from './resolvers/sms';
import { TemplateResolver } from './resolvers/template';
import { ParameterResolver } from './resolvers/parameter';
import { LogResolver } from './resolvers/log';
import { CommentResolver } from './resolvers/comment';
import { ConditionResolver } from './resolvers/condition';
import { DashboardResolver } from './resolvers/dashboard';

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
            ParameterTemplate,
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
            Package,
            Template,
            Parameter,
            CallPackage,
            Sms,
            Log,
            Model,
            Condition,
            Comment,
            Criteria
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
                PermissionResolver,
                RoleResolver,
                QuestionResolver,
                SurveyResolver,
                AnswerResolver,
                CallResolver,
                CustomerResolver,
                PackageResolver,
                ParameterResolver,
                TemplateResolver,
                SmsResolver,
                LogResolver,
                CommentResolver,
                ConditionResolver,
                DashboardResolver
            ],
            validate: false,
        }), 
        context : ({ req , res }) => ({ req , res})
        
    })
    apolloServer.applyMiddleware({ app , cors : false , path: "/"});
    const httpServer = http.createServer(app);
    // apolloServer.installSubscriptionHandlers(httpServer);
    httpServer.listen(process.env.PORT,() => {
        console.log(`server is running on port ${process.env.PORT}`)
    })
}
main().catch(err => {
    console.log(err)
})