import { Field, InputType, Int  } from 'type-graphql';

@InputType()
export class UserSearchInput {
    @Field({nullable : true})
    name?: string;
    @Field({nullable : true})
    mobile?: string;
    @Field({nullable : true})
    email?: string;
    @Field({nullable : true})
    active?: boolean;
    @Field( () => Int , {nullable : true})
    roleId?: number;
}

@InputType()
export class UserRegisterInput {
    @Field({nullable : true})
    name?: string;
    @Field()
    mobile!: string;
    @Field({nullable : true})
    email?: string;
    @Field({nullable : true})
    active?: boolean;
    @Field( () => Int , {nullable : true})
    roleId?: number;
}

@InputType()
export class QuestionInput {
    @Field({nullable : true})
    title?: string;
    @Field(() => Int , {nullable : true})
    turn?: number;
    @Field( () => Int , {nullable : true})
    typeId?: number;
    @Field( () => Int , {nullable : true})
    surveyId?: number;
    @Field({nullable : true})
    shouldBe?: boolean;
    @Field({nullable : true})
    isUsedOk?: boolean;
    @Field({nullable : true})
    status?: boolean;
}
@InputType()
export class QuestionSearchInput {
    @Field({nullable : true})
    title?: string;
    @Field( () => Int , {nullable : true})
    typeId?: number;
    @Field( () => Int , {nullable : true})
    answerId?: number;
    @Field( () => Int , {nullable : true})
    surveyId?: number;
    @Field({nullable : true})
    shouldBe?: boolean;
    @Field({nullable : true})
    status?: boolean;
}

@InputType()
export class SurveyInput {
    @Field()
    title!: string;
    @Field()
    status?: boolean;

}
@InputType()
export class SurveySearchInput {
    @Field( () => Int , {nullable : true})
    questionId?: number;
    @Field( () => Int , {nullable : true})
    smsId?: number;
    @Field({nullable : true})
    title?: string;
    @Field({nullable : true})
    status?: boolean;
}
@InputType()
export class CustomerSearchInput {
    @Field({nullable : true})
    name?: string;
    @Field({nullable : true})
    mobile?: string;
    @Field({nullable : true})
    phone?: string;
    @Field(() => Int , {nullable : true})
    customerId?: number;
    @Field()
    status?: boolean;
}
@InputType()
export class ParameterSearchInput {
    @Field({nullable : true})
    title?: string;
    @Field({nullable : true})
    label?: string;
    @Field()
    status?: boolean;
}
@InputType()
export class TemplateSearchInput {
    @Field(() => Int , {nullable : true})
    smsId?: number;
    @Field(() => Int , {nullable : true})
    parameterId?: number;
    @Field({nullable : true})
    title?: string;

    @Field(() => Int , {nullable : true})
    tempNumber?: number;
    @Field({nullable : true})
    link?: string;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    isDynamicLink?: boolean;
}
@InputType()
export class CallSearchInput {
    @Field({nullable : true})
    beginDate?: string;
    @Field({nullable : true})
    beginTime?: string;
    @Field({nullable : true})
    endDate?: string;
    @Field({nullable : true})
    endTime?: string;
    @Field({nullable : true})
    name?: string;
    @Field({nullable : true})
    mobile?: string;
    @Field({nullable : true})
    phone?: string;
    @Field({nullable : true})
    issue?: string;
    @Field({nullable : true})
    minorIssue?: string;
    @Field({nullable : true})
    exactIssue?: string;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    callCode?: string;
    @Field({nullable : true})
    year?: string;
    @Field({nullable : true})
    month?: string;
    @Field(() => Int , {nullable : true})
    customerId?: number;
    @Field(() => Int , {nullable : true})
    packageId?: number;
}

@InputType()
export class CustomerInput {
    @Field({nullable : true})
    name?: string;
    @Field({nullable : true})
    mobile?: string;
    @Field({nullable : true})
    phone?: string;
    @Field()
    status?: boolean;
}
@InputType()
export class PackageSearchInput {
    @Field({nullable : true})
    title?: string;
    @Field( () => Int , {nullable : true})
    callId?: number;
    @Field({nullable : true})
    status?: boolean;
}

@InputType()
export class PackageInput {
    @Field()
    title: string;
    @Field()
    status?: boolean;
}
@InputType()
export class ParameterInput {
    @Field({nullable : true})
    title: string;
    @Field({nullable : true})
    label: string;
    @Field()
    status?: boolean;
}
@InputType()
export class TemplateInput {
    @Field({nullable : true})
    title: string;
    @Field({nullable : true})
    link?: string;
    @Field({nullable : true})
    body?: string;
    @Field(() => Int , {nullable : true})
    tempNumber?: number;
    @Field(() => [Int] , {nullable : true})
    parameters?: number[];
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    isDynamicLink?: boolean;
}
@InputType()
export class SmsInput {
    @Field(() => Int , {nullable : true})
    packageId?: number;
    @Field(() => Int , {nullable : true})
    surveyId?: number;
    @Field(() => Int , {nullable : true})
    templateId?: number;
}
@InputType()
export class CommentReportInput {
    @Field(() => Int,{nullable : true})
    surveyId? : number;
    @Field(() => Int,{nullable : true})
    questionId? : number;
    @Field({nullable : true})
    beginDate?: string;
    @Field({nullable : true})
    beginTime?: string;
    @Field({nullable : true})
    endDate?: string;
    @Field({nullable : true})
    endTime?: string;
}
@InputType()
export class SmsReportInput {
    @Field(() => Int,{nullable : true})
    surveyId? : number;

    @Field({nullable : true})
    beginDate?: string;
    @Field({nullable : true})
    beginTime?: string;
    @Field({nullable : true})
    endDate?: string;
    @Field({nullable : true})
    endTime?: string;
}
@InputType()
export class SmsSearchInput {
    @Field({nullable : true})
    beginDate?: string;
    @Field({nullable : true})
    beginTime?: string;
    @Field({nullable : true})
    endDate?: string;
    @Field({nullable : true})
    endTime?: string;
    @Field({nullable : true})
    name?: string;
    @Field({nullable : true})
    mobile?: string;
    @Field({nullable : true})
    phone?: string;
    @Field(() => Int , {nullable : true})
    callId?: number;
    @Field(() => Int , {nullable : true})
    customerId?: number;
    @Field(() => Int , {nullable : true})
    packageId?: number;
    @Field(() => Int , {nullable : true})
    templateId?: number;
    @Field({nullable : true})
    isSuccess?: boolean;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    used?: boolean;
}

@InputType()
export class AnswerInput {
    @Field({nullable : true})
    title?: string;
    @Field(() => Int , {nullable : true})
    questionId?: number;
    @Field({nullable : true})
    link?: string;
    @Field({nullable : true})
    image?: string;
    @Field()
    status?: boolean;
    @Field(() => Int , {nullable : true})
    percent?: number;
    @Field()
    flag?: boolean;
}
@InputType()
export class AnswerSearchInput {
    @Field({nullable : true})
    title?: string;
    @Field(() => Int , {nullable : true})
    questionId?: number;
    @Field({nullable : true})
    link?: string;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    flag?: boolean;
}

@InputType()
export class CallInput {

    @Field({nullable : true})
    issue?: string;
    @Field({nullable : true})
    minorIssue?: string;
    @Field({nullable : true})
    exactIssue?: string;
    @Field(() => Int , {nullable : true})
    callTime?: number;
    @Field(() => [Int] , {nullable : true})
    packageIds?: number[];
    @Field({nullable : true})
    callCode?: string;
    @Field(() => Int , {nullable : true})
    callPrice?: number;
    @Field(() => Int , {nullable : true})
    price?: number;
    @Field(() => Int , {nullable : true})
    operatorCallTime?: number;
    @Field(() => Int , {nullable : true})
    operatorDelayTime?: number;
    @Field(() => Int , {nullable : true})
    moshaverCallTime?: number;
    @Field(() => Int , {nullable : true})
    moshaverDelayTime?: number;
    @Field({nullable : true})
    month?: string;
    @Field({nullable : true})
    year?: string;
    @Field(() => Int , {nullable : true})
    customerId?: number;
    @Field()
    status?: boolean;
}

@InputType()
export class ChangePasswordInput {
    @Field()
    newPassword!: string;
    @Field()
    confirmPassword!: string;
    @Field()
    mobile!: string;
    @Field()
    code!: string;
}


@InputType()
export class RoleInput {
    @Field()
    title!: string;
    @Field()
    label!: string;
    @Field()
    status?: boolean;
    @Field(() => [String] , { nullable : true})
    permissions?: string[];
}

@InputType()
export class RoleSearchInput {
    @Field({nullable : true})
    title?: string;
    @Field({nullable : true})
    label?: string;
    @Field(() => Int,{nullable : true})
    roleId?: number
    @Field({nullable : true})
    status?: boolean;
    @Field(() => [Int],{nullable : true})
    permissionIds?: number[];
}

@InputType()
export class PermissionInput {
    @Field()
    title!: string;
    @Field()
    label!: string;
    @Field()
    model!: string;
    @Field()
    status?: boolean;
}
@InputType()
export class PermissionSearchInput {
    @Field(() => Int,{nullable : true})
    permissionId?: number
    @Field({nullable : true})
    title?: string;
    @Field({nullable : true})
    label?: string;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    model?: string;
    @Field(() => [Int],{nullable : true})
    roleIds?: number[];
}

@InputType()
export class LogSearchInput {
    @Field(() => Int,{nullable : true})
    userId?: number
    @Field(() => Int, {nullable : true})
    modelId?: number;
    @Field( () => Int, {nullable : true})
    rowId?: number;
    @Field({nullable : true})
    operation?: string;
    @Field({nullable : true})
    beginDate?: string;
    @Field({nullable : true})
    beginTime?: string;
    @Field({nullable : true})
    endDate?: string;
    @Field({nullable : true})
    endTime?: string;
}

@InputType()
export class CommentSearchInput {
    @Field(() => Int,{nullable : true})
    questionId?: number
    @Field(() => Int,{nullable : true})
    smsId?: number
    @Field(() => Int, {nullable : true})
    answerId?: number;
    @Field(() => Int, {nullable : true})
    customerId?: number;
    @Field(() => Int, {nullable : true})
    typeId?: number;
    @Field(() => Int, {nullable : true})
    callId?: number;
    @Field({nullable : true})
    status?: boolean;
    @Field({nullable : true})
    text?: string;
}
@InputType()
export class CommentInput {
    @Field(() => Int)
    smsId!: number
    @Field(() => Int)
    questionId!: number
    @Field(() => [Int], {nullable : true})
    answerIds?: number[];
    @Field({nullable : true })
    text?: string;
    @Field({nullable : true })
    flag?: boolean;
}

@InputType()
export class ConditionSearchInput {
    @Field(() => Int,{nullable : true})
    surveyId?: number
    @Field({nullable : true})
    status?: boolean;
}
@InputType()
export class ConditionInput {
    @Field(() => Int , {nullable : true})
    consQuestionId?: number
    @Field(() => Int , {nullable : true})
    questionId?: number
    @Field(() => Int, {nullable : true})
    answerId?: number;
    @Field(() => Int, {nullable : true })
    criteriaId?: number;
    @Field({nullable : true})
    status?: boolean;
}
