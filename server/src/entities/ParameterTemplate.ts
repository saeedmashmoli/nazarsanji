import { Entity, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm";
import { Parameter } from "./Parameter";
import { Template } from "./Template";


@Entity()
export class ParameterTemplate extends BaseEntity {

    @PrimaryColumn()
    templateId: number;

    @PrimaryColumn()
    parameterId: number;

    @ManyToOne(() => Template, { primary : true })
    @JoinColumn()
    template: Promise<Template>;
 
    @ManyToOne(() => Parameter, { primary : true })
    @JoinColumn()
    parameter: Promise<Parameter>;

}