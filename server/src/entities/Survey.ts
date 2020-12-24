import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Question } from "./Question";
import { Sms } from "./Sms";

@ObjectType()
@Entity()
export class Survey extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @Column()
    title!: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status: boolean;

    @OneToMany(() => Sms, (send) => send.survey)
    sends: Sms[];

    @OneToMany(() => Question, (question) => question.survey)
    questions: Question[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}