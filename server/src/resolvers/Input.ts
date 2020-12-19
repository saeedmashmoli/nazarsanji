import { Field, InputType, Int  } from 'type-graphql';


@InputType()
export class UserRegisterInput {
    @Field()
    name?: string;
    @Field()
    mobile!: string;
    @Field()
    email?: string;
    @Field()
    active?: boolean;
    @Field( () => Int , {nullable : true})
    roleId?: number;
}

@InputType()
export class QuestionInput {
    @Field()
    title!: string;
    @Field( () => Int , {nullable : true})
    typeId?: number;
    @Field( () => Int , {nullable : true})
    surveyId?: number;
    @Field()
    shouldBe?: boolean;
    @Field()
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
export class PackageInput {
    @Field()
    title!: string;
    @Field()
    status?: boolean;
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
export class CallInput {
    @Field({nullable : true})
    issue?: string;
    @Field({nullable : true})
    minorIssue?: string;
    @Field({nullable : true})
    exactIssue?: string;
    @Field(() => Int , {nullable : true})
    callTime?: number;
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
    @Field(() => Int , {nullable : true})
    packageId?: number;
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
