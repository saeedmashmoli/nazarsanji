import { Token } from "./Token";
import { Field, ObjectType  } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn , BaseEntity, OneToOne } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({unique : true})
    mobile!: string;

    @Field()
    @Column({ nullable : true})
    name: string;

    @Field() 
    @Column({ nullable : true })
    email: string;

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
    @Column('int')
    tokenId: number;

    @OneToOne(() => Token, (token) => token.creator , {nullable : true})
    token: Token;

    // @OneToMany(() => Message, (message) => message.sender)
    // messages: Message[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

}