import { Condition } from '../entities/Condition';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { ConditionInput, ConditionSearchInput } from './Input';
import { conditionValidator } from '../validators/conditionValidator';
import { getConnection, In, Not } from 'typeorm';
import { MyContext } from '../types';
// import { Log } from '../entities/Log';
import { Question } from '../entities/Question';
import { Answer } from '../entities/Answer';
import { Criteria } from '../entities/Criteria';
import { Survey } from '../entities/Survey';


@ObjectType()
export class PaginatedConditions {
    @Field()
    total!: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Condition],{ nullable : true })
    conditions?: Condition[];
}

@ObjectType()
export class ConditionResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Condition , { nullable : true })
    condition?: Condition;
}
@ObjectType()
export class ConditionsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedConditions , { nullable : true })
    docs?: PaginatedConditions;
}
@ObjectType()
export class ConditionOptionsResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => [Survey] , { nullable : true })
    surveys?: Survey[];
    @Field(() => [Criteria] , { nullable : true })
    criterias?: Criteria[];
}

@Resolver(Condition)
export class ConditionResolver {

    @FieldResolver(() => Question)
    async question( 
      @Root() condition : Condition,
    ){return await Question.findOne(condition.questionId)}
    @FieldResolver(() => Question)
    async consQuestion( 
      @Root() condition : Condition,
    ){return await Question.findOne(condition.consQuestionId)}

    @FieldResolver(() => Answer)
    async answer( 
      @Root() condition : Condition,
    ){return Answer.findOne(condition.answerId)}
    
    @FieldResolver(() => Criteria)
    async criteria( 
      @Root() condition : Condition,
    ){return Criteria.findOne(condition.criteriaId)}
    
    @Query(() => ConditionOptionsResponse)
    async getOptionsForCreateAndUpdateCondition() : Promise<ConditionOptionsResponse> {
        const surveys = await Survey.find({where : {status : true}});
        const criterias = await Criteria.find({where : {status : true}});
        return {status : true , surveys , criterias}
    }
    @Query(() => [Question])
    async getQuestionsForCreateAndUpdateCondition(
        @Arg('surveyId' , () => Int) surveyId : number
    ) : Promise<Question[]> {
        return await Question.find({where : {status : true , surveyId , typeId : Not(In([5]))}});
    }
    @Query(() => [Answer])
    async getAnswersForCreateAndUpdateCondition(
        @Arg('questionId' , () => Int) questionId : number
    ) : Promise<Answer[]> {

        return await Answer.find({where : {status : true , questionId}});
    }

    @Mutation(() => ConditionsResponse)
    // @UseMiddleware(isAuth,isCan("Condition-show" , "Condition"))
    async getConditions(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input') input: ConditionSearchInput,
    ) : Promise<ConditionsResponse>{
        const { status , surveyId } = input;
        const currentPage = page || 1;
        const take = limit || 10;
        const skip = (currentPage - 1) * take;
        const tableName = "`condition`";
        const query = `from ${tableName} as s 
        ${surveyId ? `left join question as q on q.id = s.questionId ` : ""}
        where s.status = ${status ? status : "s.status"} 
        ${surveyId ? ` and q.surveyId = ${surveyId} ` : ""}
        `;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const conditions = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        const total = t[0].count;
        let pages = Math.floor((total % take > 0) ? (total / take) + 1 : (total / take)) as number

        return {status : true , docs : {conditions , total , page : currentPage , pages}}
    }
    @Mutation(() => ConditionResponse)
    // @UseMiddleware(isAuth,isCan("Condition-show" , "Condition"))
    async getCondition(
        @Arg('id' , () => Int) id : number
    ) : Promise<ConditionResponse>{
        const errors = await conditionValidator(null, id );
        if(errors?.length) return { status : false , errors};
        const condition = await Condition.findOne({id});
        return { status : true , condition }
    }

    @Mutation(() => ConditionResponse)
    async createCondition(
        @Arg('input') input: ConditionInput,
        @Ctx() {payload} : MyContext
    ) : Promise<ConditionResponse>{
        const errors = await conditionValidator(input,null);
        if(errors?.length) return { status : false , errors};
        await Condition.create({...input}).save();


        return { status: true };
    }

    @Mutation(() => ConditionResponse)
    // @UseMiddleware(isAuth,isCan("Condition-update" , "Condition"))
    async updateCondition(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: ConditionInput,
        // @Ctx() {payload} : MyContext
    ) : Promise<ConditionResponse>{
        let errors = await conditionValidator(input , id);
        if(errors?.length) return { status : false , errors};
        await Condition.update({id} , {...input});
 
   
        return { status: true };
    }

    @Mutation(() => ConditionResponse)
    // @UseMiddleware(isAuth,isCan("Condition-delete" , "Condition"))
    async activeOrDeactiveCondition(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        // @Ctx() {payload} : MyContext
    ) : Promise<ConditionResponse>{
        const errors = await conditionValidator(null, id);
        if(errors?.length) return { status : false , errors};
        await Condition.update({id},{ status });

        return {status : true};
    }
}

        // const data = {
        //     userId : payload?.userId ,
        //     modelId : 1 ,
        //     operation : `create : ${Condition}`,
        //     rowId : Condition.id 
        // } as any
        // await Log.create({...data}).save();