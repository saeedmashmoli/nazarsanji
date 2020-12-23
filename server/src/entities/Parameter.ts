import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Question } from "./Question";


@ObjectType()
@Entity()
export class Parameter extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;   

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    label!: string;

    @Field()
    @Column({default : true})
    status!: boolean;

    @OneToMany(() => Question, question => question.type)
    templates: Question[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}