import {MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from 'bcrypt'

export class initialData1607679363838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into role (title ,label) values ('admin','مدیر سایت'),('user','کاربر');
        `)
        
        await queryRunner.query(`
            insert into type (title) values ('تک انتخابی'),('چند انتخابی'),('تشریحی'),('گردونه'),('خوشامد گویی'),('خداحافظی');
        `)
        await queryRunner.query(
            "insert into user (name ,mobile,`roleId` , active , password ) values (?,?,?,?,?);",
            ["ادمین", "09196426612",
            1,1,await bcrypt.hash("123456" , 10)]
        )
        
    }
    public async down(_: QueryRunner): Promise<void> {}

}
