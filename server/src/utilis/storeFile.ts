import { Upload } from '../types';
import xlsx from 'xlsx';
import { createWriteStream } from 'fs';
import mkdirp from 'mkdirp';

export const storeUpload = async (file :Upload , dir : string) => {
    // await mkdirp(dir)
    await file.createReadStream().pipe(createWriteStream(dir+file.filename));
    return dir+file.filename;
} 
export const jsonDataFromExcel = async (dir : string) => {
        let wb = xlsx.readFile(dir,{cellDates : true});
        let ws = wb.Sheets[wb.SheetNames[0]];
        return await xlsx.utils.sheet_to_json(ws);
}