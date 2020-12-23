import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne  } from "typeorm";
import { Parameter } from "./Parameter";



@ObjectType()
@Entity()
export class Template extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    

    @Field()
    @Column()
    title!: string;

    @Field({ nullable : true })
    @Column({ nullable : true })
    link?: string;

    @Field()
    @Column()
    tempNumber!: number;

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