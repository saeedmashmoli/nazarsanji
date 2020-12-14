import { Field, InputType } from 'type-graphql';


@InputType()
export class UserRegisterInput {
    @Field()
    name?: string;
    @Field()
    mobile!: string;
    @Field()
    email?: string;
}

@InputType()
export class QuestionInput {
    @Field()
    title!: string;
    @Field()
    typeId!: number;
    @Field()
    surveyId!: number;
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
export class AnswerInput {
    @Field()
    title?: string;
    @Field()
    questionId!: number;
    @Field()
    link?: string;
    @Field()
    image?: string;
    @Field()
    status?: boolean;
    @Field()
    percent?: number;
    @Field()
    flag?: boolean;
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
