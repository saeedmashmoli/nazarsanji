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
            ('status-role','تغییر وضعیت نقش', 'Role'),
            ('show-permission','نمایش دسترسی ها', 'Permission'),
            ('create-permission','ایجاد دسترسی', 'Permission'),
            ('update-permission','ویرایش دسترسی', 'Permission'),
            ('status-permission','تغییر وضعیت دسترسی', 'Permission'),
            ('show-survey','نمایش نظرسنجی ها', 'Survey'),
            ('create-survey','ایجاد نظرسنجی', 'Survey'),
            ('update-survey','ویرایش نظرسنجی', 'Survey'),
            ('status-survey','تغییر وضعیت نظرسنجی', 'Survey'),
            ('show-question','نمایش سوالات نظرسنجی ها', 'Question'),
            ('create-question','ایجاد سوالات نظرسنجی', 'Question'),
            ('update-question','ویرایش سوالات نظرسنجی', 'Question'),
            ('status-question','تغییر وضعیت سوالات نظرسنجی', 'Question'),
            ('show-parameter','نمایش پارامتر ها', 'Parameter'),
            ('create-parameter','ایجاد پارامتر', 'Parameter'),
            ('update-parameter','ویرایش پارامتر', 'Parameter'),
            ('status-parameter','تغییر وضعیت پارامتر', 'Parameter'),
            ('show-template','نمایش قالب ها', 'Template'),
            ('create-template','ایجاد قالب', 'Template'),
            ('update-template','ویرایش قالب', 'Template'),
            ('status-template','تغییر وضعیت قالب', 'Template'),
            ('show-user','نمایش کاربر ها', 'User'),
            ('create-user','ایجاد کاربر', 'User'),
            ('update-user','ویرایش کاربر', 'User'),
            ('status-user','تغییر وضعیت کاربر', 'User'),
            ('show-answer','نمایش گزینه ها', 'Answer'),
            ('create-answer','ایجاد گزینه', 'Answer'),
            ('update-answer','ویرایش گزینه', 'Answer'),
            ('status-answer','تغییر وضعیت گزینه', 'Answer'),
            ('show-call','نمایش تماس ها', 'Call'),
            ('create-call','ایجاد تماس', 'Call'),
            ('update-call','ویرایش تماس', 'Call'),
            ('status-call','تغییر وضعیت تماس', 'Call'),
            ('show-customer','مدیریت مشتری ها', 'Customer'),
            ('create-customer','ایجاد مشتری', 'Customer'),
            ('update-customer','ویرایش مشتری', 'Customer'),
            ('status-customer','تغییر وضعیت مشتری', 'Customer'),
            ('show-package','نمایش بسته ها ', 'Package'),
            ('create-package','ایجاد بسته', 'Package'),
            ('update-package','ویرایش بسته', 'Package'),
            ('status-package','تغییر وضعیت بسته', 'Package'),
            ('show-report','گزارشات', 'Report');
        `);
        await queryRunner.query(
            "insert into permission_role (`roleId` ,`permissionId`) values (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45);"
        );
        await queryRunner.query(`
            insert into type (title) values ('تک انتخابی'),('چند انتخابی'),('تشریحی'),('گردونه'),('خوشامد گویی'),('خداحافظی');
        `)
        await queryRunner.query(`
            insert into parameter (title,label) values 
            ('mobile','ارسال شماره موبایل'),
            ('name','ارسال نام مشتری'),
            ('callTime','ارسال زمان مکالمه'),
            ('callPrice','ارسال مبلغ مکالمه'),
            ('issue','ارسال موضوع مشاوره'),
            ('minorIssue','ارسال موضوع جزئی مشاوره'),
            ('exactIssue','ارسال موضوع جزئی مشاوره')
            ;`)
        await queryRunner.query(
            "insert into user (name ,mobile,`roleId` , active , password ) values (?,?,?,?,?);",
            ["ادمین", "09196426612",
            1,1,await bcrypt.hash("123456" , 10)]
        )
        
    }
    public async down(_: QueryRunner): Promise<void> {}

}
