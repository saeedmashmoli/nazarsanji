import { Request , Response  } from "express";
import { Stream } from "stream";
import { createParametersLoader } from "./utilis/parametersLoader";



export type MyContext = {
    req: Request ;
    res: Response;
    payload?: { userId: String };
    parametersLoader: ReturnType<typeof createParametersLoader>;
}
export interface Upload{
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): Stream;
}


