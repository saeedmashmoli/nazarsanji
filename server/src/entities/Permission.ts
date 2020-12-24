import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToMany, getConnection } from "typeorm";
import { PermissionRole } from "./PermissionRole";
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

    @OneToMany(() => PermissionRole, permissionRole => permissionRole.permission)
    roleConnection : Promise<PermissionRole[]>;


    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}



   