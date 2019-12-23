import { Request, Response, NextFunction, Router } from 'express';
import { HandlerManagers } from './handler-managers';
import { modelValidator } from '../server-config/middleware';
import { ILoginModel } from '../inventory-model';
import { loginValidationSchema } from '../utilities/validation-schemas';
export class AccountCommandHandler extends HandlerManagers {
    constructor(router: Router) {
        super();
        router.post('/token', modelValidator(loginValidationSchema), this.getUserToken.bind(this));
    }
    getUserToken(req: Request, res: Response, next: NextFunction): void {
        let login: ILoginModel = req.body;
        this.accountQueryManager.getUserByCredentials(login)
            .subscribe((result) => {
                if (result != null) {
                    res.status(200).send({ token: result.id });
                }
                else {
                    res.status(404).send(result);
                }
                return;
            }, (err) => {
                res.status(500).send('Server error!!!!');
                return next(err);
            });
    }
}
