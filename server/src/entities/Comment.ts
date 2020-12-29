import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne  } from "typeorm";
import { Answer } from "./Answer";
import { Question } from "./Question";
import { Sms } from "./Sms";



@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    smsId!: number;

    @Field(() => Sms)
    @ManyToOne(() => Sms, sms => sms.comments)
    sms: Sms;

    @Field()
    @Column()
    questionId!: number;

    @Field(() => Question)
    @ManyToOne(() => Question, question => question.comments)
    question: Question;

    @Field({nullable:true})
    @Column({nullable:true})
    answerId?: number;

    @Field(() => Answer)
    @ManyToOne(() => Answer, answer => answer.comments)
    answer: Answer;

    @Field(() => String , { nullable : true })
    @Column({ nullable : true , length : 1000})
    text?: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status?: boolean;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}