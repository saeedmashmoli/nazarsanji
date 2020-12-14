import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToMany } from "typeorm";
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

    @Field(() => [Role])
    async roles() : Promise<Role[]> {
        const permissionRoles = await PermissionRole.find({where : {permissionId : this.id}});
        const permits = [] as any ;
        await permissionRoles.forEach( p => {
            permits.push(p.role)
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



   