import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Sms } from "./Sms";




@ObjectType()
@Entity()
export class Template extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    

    @Field()
    @Column()
    title!: string;

    @Field({ nullable : true })
    @Column({ nullable : true , length : 1000 })
    body?: string;

    @Field()
    @Column({ default : true })
    isDynamicLink?: boolean;

    @Field({ nullable : true })
    @Column({ nullable : true })
    link?: string;

    @Field()
    @Column()
    tempNumber!: number;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status?: boolean;

    @OneToMany(() => Sms, (send) => send.template)
    sends: Sms[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}