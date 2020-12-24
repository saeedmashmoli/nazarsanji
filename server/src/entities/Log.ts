import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany, ManyToOne  } from "typeorm";
import { Model } from "./Model";
import { User } from "./User";


@ObjectType()
@Entity()
export class Log extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;   

    @Field()
    @Column({length : 255})
    operation!: string;

    @Field()
    @Column()
    modelId!: number;

    @Field(() => Model)
    @ManyToOne(() => Model,model => model.logs)
    model: Model;

    @Field()
    @Column()
    userId!: number;

    @Field(() => User)
    @ManyToOne(() => User , user => user.logs)
    user: User;

    @Field()
    @Column()
    rowId!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}