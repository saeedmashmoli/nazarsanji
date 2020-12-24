import { Template } from '../entities/Template';
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root  } from 'type-graphql';
import {  FieldError } from './response';
// import { isAuth } from '../middlewares/isAuthMiddleware';
// import {isCan} from '../middlewares/isCanMiddleware';
import { TemplateInput, TemplateSearchInput } from './Input';
import { templateValidator } from '../validators/templateValidator';
import { getConnection } from 'typeorm';
import { Parameter } from '../entities/Parameter';
import { ParameterTemplate } from '../entities/ParameterTemplate';
import { MyContext } from '../types';
import { Log } from '../entities/Log';



@ObjectType()
export class TemplateResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => Template , { nullable : true })
    template?: Template;
}

@ObjectType()
export class PaginatedTemplates {
    @Field()
    total: number;
    @Field()
    page!: number;
    @Field()
    pages!: number;
    @Field(() => [Template] , { nullable : true })
    templates?: Template[];
}
@ObjectType()
export class TemplatesResponse {
    @Field(() => [FieldError] , { nullable : true })
    errors?: FieldError[];
    @Field(() => Boolean)
    status!: Boolean;
    @Field(() => PaginatedTemplates , { nullable : true })
    docs?: PaginatedTemplates;
}

@Resolver(Template)
export class TemplateResolver {
    protected async addParameterToTemplate(templateId: number , parameterId : number) {
        await ParameterTemplate.create({templateId , parameterId}).save();
    }
    protected async deleteParameterFromTemplate(templateId: number , parameterId : number) {
        await ParameterTemplate.delete({templateId , parameterId});
    }

    @FieldResolver(() => [Int])
    async parameters( 
        @Root() template : Template,
    ){
        const templateParameters = await ParameterTemplate.find({where : {templateId : template.id}});
        const parameters = [] as number[] ;
        await templateParameters.forEach( t => {
            parameters.push(t.parameterId)
        })
        return parameters;
    }

    @Query(() => [Parameter])
    async getParametersForCreateTemplate() : Promise<Parameter[]> {
        return await Parameter.find({where : {status : true}});
    }

    @Mutation(() => TemplatesResponse)
    // @UseMiddleware(isAuth,isCan("template-show" , "Template"))
    async getTemplates(
        @Arg('limit', () => Int, {nullable : true}) limit: number,
        @Arg('page', () => Int,{nullable : true}) page: number,
        @Arg('input', { nullable : true}) input: TemplateSearchInput
    ) : Promise<TemplatesResponse>{
        const { status , title , tempNumber , link ,isDynamicLink ,parameterId ,smsId} = input;
        let currentPage = page || 1;
        let take = limit || 10;
        let skip = (currentPage - 1) * take;
        let query = `from template as s 
        ${parameterId ? `left join parameter_template as pt on pt.templateId = s.id` : ""}
        ${smsId ? `left join sms as a on a.templateId = s.id` : ""}
        where ${status ? `s.status = ${status}` : "s.status = s.status"}
        ${smsId ? `and a.id = ${smsId}` : ""}
        ${parameterId ? `and pt.parameterId = ${parameterId}` : ""}
        ${isDynamicLink ? `and isDynamicLink = ${isDynamicLink} `: ""}
        ${title ? `and title like '%${title}%' `: ""}
        ${tempNumber ? `and tempNumber like '%${tempNumber}%' `: ""}
        ${link ? `and link like '%${link}%' `: ""}` ;
        const t = await getConnection().query(`select count(*) as 'count' ${query}`);
        const templates = await getConnection().query(`select s.* ${query} order by id desc limit ${skip},${take}`);
        let pages = Math.floor((t[0].count % take > 0) ? (t[0].count / take) + 1 : (t[0].count / take)) as number
        return { status : true , docs : { templates , total :t[0].count , page : currentPage , pages }}
    }
    @Query(() => TemplateResponse)
    // @UseMiddleware(isAuth,isCan("template-show" , "Template"))
    async getTemplate(
        @Arg('id' , () => Int) id : number
    ) : Promise<TemplateResponse>{
        const errors = await templateValidator(null, id);
        if(errors?.length) return { status : false , errors};
        const template = await Template.findOne({id});
        return { status : true , template }
    }

    @Mutation(() => TemplateResponse)
    // @UseMiddleware(isAuth,isCan("template-create" , "Template"))
    async createTemplate(
        @Arg('input') input: TemplateInput,
        @Ctx() {payload} : MyContext
    ) : Promise<TemplateResponse>{
        const {parameters, tempNumber , title , link , status , isDynamicLink} = input;
        const errors = await templateValidator(input);
        if(errors?.length) return { status : false , errors};
        const template = await Template.create({tempNumber,link,title , status , isDynamicLink}).save();
  
        if(parameters){
            await parameters?.forEach(p => {
                this.addParameterToTemplate(template.id,p)
            })
        }
        
        
        return { status: true };
    }

    @Mutation(() => TemplateResponse)
    // @UseMiddleware(isAuth,isCan("template-update" , "Template"))
    async updateTemplate(
        @Arg('id' , () => Int) id: number,
        @Arg('input') input: TemplateInput,
        @Ctx() { payload} : MyContext
    ) : Promise<TemplateResponse>{
        const {parameters, tempNumber , title , link , status ,isDynamicLink } = input;
        let errors = await templateValidator(input , id);
        if(errors?.length) return { status : false , errors};
        const template = await Template.update({id} , {tempNumber,link,title , status ,isDynamicLink});

        const oleParameters = await ParameterTemplate.find({templateId : id});
        if(oleParameters){
            await oleParameters.forEach( param => {
                if(!parameters?.includes(param.parameterId)){
                    this.deleteParameterFromTemplate(id,param.parameterId)
                }
            })
        }
        //sync parameters to template
        await parameters?.forEach(param => {
            this.addParameterToTemplate(id,param)
        })
        return { status: true };
    }

    @Mutation(() => TemplateResponse)
    // @UseMiddleware(isAuth,isCan("template-delete" , "Template"))
    async activeOrDeactiveTemplate(
        @Arg('id' , () => Int) id: number,
        @Arg('status') status: boolean,
        @Ctx() { payload} : MyContext
    ) : Promise<TemplateResponse>{
        const errors = await templateValidator(null, id);
        if(errors?.length) return { status : false , errors};
        const template = await Template.update({id},{ status });

        return {status : true};
    }
}

// const data = {
//     userId : payload?.userId ,
//     modelId : 7 ,
//     operation : `activeOrDeactive : ${template}`,
//     rowId : id 
// } as any
// await Log.create({...data}).save();