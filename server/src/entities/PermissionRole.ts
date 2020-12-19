import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Permission } from "./Permission";
import { Role } from "./Role";


@Entity()
export class PermissionRole extends BaseEntity {

    @PrimaryColumn()
    roleId: number;

    @PrimaryColumn()
    permissionId: number;

    
    @ManyToOne(() => Role, { primary : true })
    @JoinColumn()
    role: Promise<Role>;
 
    @ManyToOne(() => Permission, { primary : true })
    @JoinColumn()
    permission: Promise<Permission>;

}