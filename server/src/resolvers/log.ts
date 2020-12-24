import { Log } from '../entities/Log';
import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { LogSearchInput } from './Input';
import { getConnection } from 'typeorm';
import { Model } from '../entities/Model';
import { User } from '../entities/User';

@ObjectType()
export class PaginatedLogs {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Log] , { nullable : true })
    logs?: Log[];
}
@ObjectType()
export class LogsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedLogs , { nullable : true })
    docs?: PaginatedLogs;
}
@ObjectType()
export class UsersAndModelsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [User] , { nullable : true })
    users?: User[];
    @Field(() => [Model] , { nullable : true })
    models?: Model[];
}

@Resolver(Log)
export class LogResolver {

    @FieldResolver(() => Model)
    model( 
      @Root() log : Log,
    ){return Model.find({where : {id :log.modelId}})}
    @FieldResolver(() => Model)
    user( 
      @Root() log : Log,
    ){return User.find({where : {id :log.userId}})}
    
    @Query(() => UsersAndModelsResponse)
    async getUsersAndModelsForShowLogs() : Promise<UsersAndModelsResponse> {
        const models = await Model.find({});
        const users = await User.find({}); 
        return {status : true , models , users}
    }

    @Mutation(() => LogsResponse)
    // @UseMiddleware(isAuth,isCan("customer-show" , "customer"))
    async getLogs(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', {nullable : true}) input: LogSearchInput
    ) : Promise<LogsResponse>{
        const { modelId , rowId , userId , operation } = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        const tableName = "`log`";
        let query = `from ${tableName} as s 
        where ${operation ? `operation like ${operation}` : "operation = operation"}
        ${modelId ? `and modelId = ${modelId}' `: ""}
        ${rowId ? `and rowId = ${rowId} ` : ""}
        ${userId ? `and userId = ${userId} ` : ""}` ;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const logs = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return {status : true , docs : {logs , total :t[0].count , page : currentPage , pages }}
    }
}