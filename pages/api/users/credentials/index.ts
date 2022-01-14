import {
    CreateRootHandlerParams,
    RequestMethodHandler,
    createMethodHandler,
    createRootHandler,
} from '../../../../util/requests';

import { RequestMethods } from '../../../../lib/constants/httpRequestMethods';
import { StatusCodes } from 'http-status-codes';
import { credentialUsersCollection } from '../../../../entities/CredentialUser';
import { hashString } from '../../../../util/hash';

const handlePostRequest: RequestMethodHandler = async (req, res, db) =>
    createMethodHandler({
        requireToken: false,
        callback: async (request, response) => {
            const user = {
                username: request.body.username,
                password: await hashString(request.body.password),
            };
            await db.collection(credentialUsersCollection).insertOne({
                ...user,
            });
            response.status(StatusCodes.CREATED).json(null);
        },
    })(req, res, db);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.POST]: handlePostRequest,
};

export default createRootHandler(requestMethodHandlers);
