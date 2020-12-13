import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, ManyToMany, JoinTable } from "typeorm";
import { Permission } from "./Permission";

@ObjectType()
@Entity()
export class Role extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    label!: string;

    @Field()
    @Column()
    title!: string;

    @Field()
    @Column({default : true})
    status!: boolean;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}