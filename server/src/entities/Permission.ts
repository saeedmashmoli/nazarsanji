import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, ManyToMany } from "typeorm";
import { Role } from "./Role";

@ObjectType()
@Entity()
export class Permission extends BaseEntity {

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
    @Column()
    model!: string;

    @Field()
    @Column({default : true})
    status!: boolean;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}



   