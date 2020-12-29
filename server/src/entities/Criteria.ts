import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Condition } from "./Condition";


@ObjectType()
@Entity()
export class Criteria extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;   

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    symbol!: string;

    @Field()
    @Column({default : true})
    status!: boolean;

    @OneToMany(() => Condition, condition => condition.criteria)
    conditions: Condition[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}