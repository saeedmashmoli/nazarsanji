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
export class ChangePasswordInput {
    @Field()
    newPassword!: string;
    @Field()
    confirmPassword!: string;
    @Field()
    mobile!: string;
    @Field()
    code!: number;
}
