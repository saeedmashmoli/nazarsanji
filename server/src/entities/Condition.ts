import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne  } from "typeorm";
import { Question } from "./Question";
import { Criteria } from "./Criteria";
import { Answer } from "./Answer";


@ObjectType()
@Entity()
export class Condition extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    consQuestionId!: number;

    @Field(() => Question)
    @ManyToOne(() => Question, question => question.conditions)
    consQuestion: Question;

    @Field()
    @Column()
    questionId!: number;

    @Field(() => Question)
    @ManyToOne(() => Question)
    question: Question;

    @Field()
    @Column()
    criteriaId!: number;

    @Field(() => Criteria)
    @ManyToOne(() => Criteria, criteria => criteria.conditions)
    criteria: Criteria;

    @Field()
    @Column()
    answerId!: number;

    @Field(() => Answer)
    @ManyToOne(() => Answer, answer => answer.conditions)
    answer: Answer;

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