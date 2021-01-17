import { Field, ObjectType, Query, Resolver } from "type-graphql";
import { FieldError } from "./response";
import {Comment} from '../entities/Comment';
import { getConnection } from "typeorm";

@ObjectType()
export class DashboardResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Number ,{ nullable : true })
    commentsCount?: string;
    @Field(() => Number , { nullable : true })
    smsCount?: string;
    @Field(() => [Comment] , { nullable : true })
    comments?: Comment[];
}

@Resolver()
export class DashboardResolver {
    @Query(() => DashboardResponse)
    async getDataForDashboard() : Promise<DashboardResponse>{
        const sCount = await getConnection().query(`
            select count(*) as 'count' from sms as s where status = true
        `)
        const cCount = await getConnection().query(`
            select count(*) as 'count' from ( select c.smsId,count(*) as 'count' from comment as c group by c.smsId) as t1     
        `)
        const comments = await getConnection().query(`
            select * from comment as c
            left join question as q on c.questionId = q.id
            where q.typeId = 3
            order by c.id desc limit 12
        `)
        return {status : true , comments , commentsCount : cCount[0].count , smsCount : sCount[0].count}
    }


}