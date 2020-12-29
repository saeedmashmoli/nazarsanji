import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, ManyToOne, UpdateDateColumn, OneToMany  } from "typeorm";
import { Call } from "./Call";
import { Survey } from "./Survey";
import { Template } from "./Template";
import { Comment } from "./Comment";


@ObjectType()
@Entity()
export class Sms extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    token: string;

    @Field()
    @Column()
    callId!: number;

    @Field(() => Call)
    @ManyToOne(() => Call , call => call.sends)
    call: Call;

    @Field()
    @Column()
    templateId!: number;

    @Field(() => Template)
    @ManyToOne(() => Template , template => template.sends)
    template: Template;
    @Field()

    @Column()
    surveyId!: number;

    @Field(() => Survey)
    @ManyToOne(() => Survey , survey => survey.sends)
    survey: Survey;

    @Field(() => Boolean)
    @Column('boolean',{ default : 0})
    isSuccess?: boolean;

    @Field(() => String,{nullable : true})
    @Column({ nullable : true, length : 1000})
    message?: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 0})
    used: boolean;
    
    @Field(() => Boolean)
    @Column('boolean',{ default : 0})
    checkSms: boolean;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status: boolean;

    @OneToMany(() => Comment, (comment) => comment.sms)
    comments: Comment[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}
