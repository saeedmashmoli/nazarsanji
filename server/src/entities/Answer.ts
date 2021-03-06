import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne, OneToMany  } from "typeorm";
import { Question } from "./Question";
import { Comment } from "./Comment";
import { Condition } from "./Condition";



@ObjectType()
@Entity()
export class Answer extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Comment, (comment) => comment.answer)
    comments: Comment[];
    @OneToMany(() => Condition, (condition) => condition.answer)
    conditions: Condition[];

    @Field()
    @Column()
    questionId!: number;

    @Field(() => Question)
    @ManyToOne(() => Question, question => question.answers)
    question: Question;

    @Field(() => String , { nullable : true })
    @Column({ nullable : true , length : 1000})
    title?: string;

    @Field(() => Int , { nullable : true })
    @Column({ nullable : true })
    percent?: number;

    @Field({ nullable : true })
    @Column({ nullable : true })
    link?: string;

    @Field({ nullable : true })
    @Column({ nullable : true })
    image?: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status?: boolean;

    @Field(() => Boolean)
    @Column('boolean',{ default : 0})
    flag?: boolean;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}