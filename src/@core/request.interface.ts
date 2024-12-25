import { Request as ExpressRequest } from 'express';
import { User } from '../@app-modules/user/entities/user.entity';

export interface Request extends ExpressRequest {
    user: User;
}
