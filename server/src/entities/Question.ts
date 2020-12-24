import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne, OneToMany  } from "typeorm";
import { Answer } from "./Answer";
import { Survey } from "./Survey";
import { Type } from "./Type";


@ObjectType()
@Entity()
export class Question extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field(() => String , { nullable : true })
    @Column({ length : 1000})
    title!: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status?: boolean;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    shouldBe?: boolean;

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

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}