import {MigrationInterface, QueryRunner} from "typeorm";
import * as bcrypt from 'bcrypt'

export class initialData1607679363838 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into role (title ,label) values ('admin','مدیر سایت'),('user','کاربر');
        `)
        await queryRunner.query(`
            insert into permission (title ,label, model) values 
            ('show-role','نمایش نقش ها', 'Role'),
            ('create-role','ایجاد نقش', 'Role'),
            ('update-role','ویرایش نقش', 'Role'),
            ('delete-role','حذف نقش', 'Role'),
            ('show-permission','نمایش دسترسی ها', 'Permission'),
            ('create-permission','ایجاد دسترسی', 'Permission'),
            ('update-permission','ویرایش دسترسی', 'Permission'),
            ('delete-permission','حذف دسترسی', 'Permission'),
            ('show-survey','نمایش نظرسنجی ها', 'Survey'),
            ('create-survey','ایجاد نظرسنجی', 'Survey'),
            ('update-survey','ویرایش نظرسنجی', 'Survey'),
            ('delete-survey','حذف نظرسنجی', 'Survey'),
            ('show-question','نمایش نقش ها', 'Question'),
            ('create-question','ایجاد نقش', 'Question'),
            ('update-question','ویرایش نقش', 'Question'),
            ('delete-question','حذف نقش', 'Question'),
            ('show-user','نمایش کاربر ها', 'User'),
            ('create-user','ایجاد کاربر', 'User'),
            ('update-user','ویرایش کاربر', 'User'),
            ('delete-user','حذف کاربر', 'User'),
            ('show-answer','نمایش گزینه ها', 'Answer'),
            ('create-answer','ایجاد گزینه', 'Answer'),
            ('update-answer','ویرایش گزینه', 'Answer'),
            ('delete-answer','حذف گزینه', 'Answer'),
            ('show-call','نمایش تماس ها', 'Call'),
            ('create-call','ایجاد تماس', 'Call'),
            ('update-call','ویرایش تماس', 'Call'),
            ('delete-call','حذف تماس', 'Call'),
            ('show-customer','مدیریت مشتری ها', 'Customer'),
            ('create-customer','ایجاد اطلاعات مشتری', 'Customer'),
            ('update-customer','ویرایش اطلاعات مشتری', 'Customer'),
            ('delete-customer','حذف اطلاعات مشتری', 'Customer'),
            ('show-package','نمایش بسته های اطلاعات مشتری', 'Package'),
            ('create-package','ایجاد بسته', 'Package'),
            ('update-package','ویرایش بسته', 'Package'),
            ('delete-package','حذف بسته', 'Package'),
            ('show-report','گزارشات', 'Report');
        `);
        await queryRunner.query(
            "insert into permission_role (`roleId` ,`permissionId`) values (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37);"
        );
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
