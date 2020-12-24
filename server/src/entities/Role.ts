import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToMany } from "typeorm";
import { PermissionRole } from "./PermissionRole";

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

    @OneToMany(() => PermissionRole, permissionRole => permissionRole.role)
    permissionConnection: Promise<PermissionRole[]>;


    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}