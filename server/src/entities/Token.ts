import { Field, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , BaseEntity, OneToOne  } from "typeorm";
import { User } from "./User";


@ObjectType()
@Entity()
export class Token extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column('int',{ default : 0})
    code: number;

    @Field()
    @Column('int')
    creatorId: number;

    @OneToOne(() => User, (user) => user.token)
    creator: User;

    @Field()
    @Column('boolean',{ default : 0})
    used: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

}

