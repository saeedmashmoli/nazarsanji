import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, OneToMany  } from "typeorm";
import { Call } from "./Call";

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable : true})
    @Column({nullable : true})
    mobile?: string;

    @Field({nullable : true})
    @Column({ nullable : true})
    name?: string;

    @Field({nullable : true}) 
    @Column({ nullable : true })
    phone?: string;

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status: boolean;

    @OneToMany(() => Call, (call) => call.customer)
    calls: Call[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}