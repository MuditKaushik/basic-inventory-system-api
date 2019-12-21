import { Request, Response, NextFunction, Router } from 'express';
export class InventoryCommandHandlers {
    constructor(router: Router) {
        router.post('/', this.sayHello.bind(this));
    }
    sayHello(req: Request, res: Response, next: NextFunction): void {
        res.status(200).send('Working');
        return;
    }
}
