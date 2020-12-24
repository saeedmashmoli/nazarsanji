import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Call } from "./Call";
import { Package } from "./Package";


@Entity()
export class CallPackage extends BaseEntity {

    @PrimaryColumn()
    packageId: number;

    @PrimaryColumn()
    callId: number;

    @ManyToOne(() => Package, { primary : true })
    @JoinColumn()
    package: Promise<Package>;
 
    @ManyToOne(() => Call, { primary : true })
    @JoinColumn()
    call: Promise<Call>;

}