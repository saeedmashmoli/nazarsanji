import { Token } from "./Token";
import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToOne, ManyToOne } from "typeorm";
import { Role } from "./Role";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique : true})
    mobile!: string;

    @Field({nullable : true})
    @Column({ nullable : true})
    name: string;

    @Field({nullable : true}) 
    @Column({ nullable : true })
    email?: string;

    @Field()
    @Column()
    password!: string;

    @Field()
    @Column({type : 'boolean' , default : false})
    active!: string;

    @Field()
    @Column('int',{ default : 0})
    tokenVersion: number;

    @Field()
    @Column()
    roleId!: number;

    
    @Field(() => Role)
    @ManyToOne(() => Role)
    role: Role;

    @Field()
    @Column()
    tokenId: number;

    @Field()
    @OneToOne(() => Token,{nullable : true})
    token: Token;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}