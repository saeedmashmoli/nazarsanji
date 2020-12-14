import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToMany } from "typeorm";
import { Permission } from "./Permission";
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

    @Field(() => [Permission])
    async permissions() : Promise<Permission[]> {
        const permissionRoles = await PermissionRole.find({where : {roleId : this.id}});

        const permits = [] as any ;
        await permissionRoles.forEach( p => {
            permits.push(p.permission)
        })
        return permits;
    }

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}