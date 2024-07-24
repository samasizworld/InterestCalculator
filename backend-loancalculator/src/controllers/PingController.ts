import { Request, Response } from "express";

export class PingController {
    async ping(req: Request, res: Response) {
        const param = req.params.anything;
        if (param) {
            return res.status(200).send({ message: "UP", params: param });
        } else {
            return res.status(200).send({ message: "UP" })
        }
    }
}