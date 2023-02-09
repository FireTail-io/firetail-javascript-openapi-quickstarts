import {
    Request, 
    Response, 
    NextFunction,
} from "express";

let internalOpts: any;

const middleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("Logging request: ", req.path);
    console.log("with opts: ", internalOpts);
    next();
}


export default (opts: any) => {
    internalOpts = opts;
    return middleware;
}