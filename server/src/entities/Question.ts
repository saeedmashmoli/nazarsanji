import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne, OneToMany  } from "typeorm";
import { Answer } from "./Answer";
import { Survey } from "./Survey";
import { Type } from "./Type";
import { Condition } from "./Condition";
import { Comment } from "./Comment";


@ObjectType()
@Entity()
export class Question extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field(() => String , { nullable : true })
    @Column({ length : 1000})
    title!: string;

    @Field()
    @Column()
    turn!: number;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status?: boolean;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    shouldBe?: boolean;

    @Field(() => Boolean)
    @Column('boolean',{ default : 0})
    isUsedOk?: boolean;


    @Field()
    @Column()
    typeId!: number;

    @Field(() => Type)
    @ManyToOne(() => Type,type => type.questions)
    type: Type;

    @Field()
    @Column()
    surveyId!: number;

    @Field(() => Survey)
    @ManyToOne(() => Survey , survey => survey.questions)
    survey: Survey;

    //has many relations
    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];
    @OneToMany(() => Condition, (condition) => condition.question)
    conditions: Condition[];
    @OneToMany(() => Comment, (comment) => comment.question)
    comments: Comment[];


    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}