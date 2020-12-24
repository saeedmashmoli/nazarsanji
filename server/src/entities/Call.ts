import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, UpdateDateColumn, ManyToOne, OneToMany  } from "typeorm";
import { Customer } from "./Customer";
import { Sms } from "./Sms";

@ObjectType()
@Entity()
export class Call extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable : true})
    @Column({nullable : true})
    issue?: string;

    @Field({nullable : true})
    @Column({nullable : true})
    minorIssue?: string;

    @Field({nullable : true})
    @Column({nullable : true})
    exactIssue?: string;

    @Field( {nullable : true} )
    @Column( { default : 0 })
    callTime?: number;

    @Field( {nullable : true})
    @Column({nullable : true})
    callCode?: string;

    @Field( {nullable : true})
    @Column({ default : 0 })
    callPrice?: number;

    @Field( {nullable : true})
    @Column({ default : 0 })
    price?: number;

    @Field( {nullable : true})
    @Column({ default : 0 })
    operatorCallTime?: number;

    @Field( {nullable : true})
    @Column({ default : 0 })
    operatorDelayTime?: number;

    @Field( {nullable : true})
    @Column({ default : 0 })
    moshaverCallTime?: number;

    @Field( {nullable : true})
    @Column({ default : 0 })
    moshaverDelayTime?: number;

    @Field( {nullable : true})
    @Column({nullable : true})
    month?: string;

    @Field( {nullable : true})
    @Column({nullable : true})
    year?: string;

    @Field()
    @Column()
    customerId!: number;

    @Field(() => Customer)
    @ManyToOne(() => Customer , customer => customer.calls)
    customer: Customer;

    @OneToMany(() => Sms, (send) => send.call)
    sends: Sms[];

    @Field(() => Boolean)
    @Column('boolean',{ default : 1})
    status: boolean;


    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
    
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}