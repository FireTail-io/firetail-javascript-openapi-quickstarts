import {
    Request, 
    Response, 
    NextFunction,
} from "express";

const middleware = (req: Request, res: Response, next: NextFunction) => {
    
}



export default (opts) => {
    return middleware;
}