import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Log } from "./Log";


@ObjectType()
@Entity()
export class Model extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;   

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column()
    label!: string;

    @OneToMany(() => Log, log => log.model)
    logs: Log[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}