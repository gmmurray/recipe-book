import {
    CreateRootHandlerParams,
    RequestMethodHandler,
    createMethodHandler,
    createRootHandler,
    getRequestToken,
} from '../../../util/requests';
import { Document, Filter } from 'mongodb';

import { CredentialUser } from '../../../entities/CredentialUser';
import { RequestMethods } from '../../../lib/constants/httpRequestMethods';
import { StatusCodes } from 'http-status-codes';
import { recipesCollection } from '../../../entities/Recipe';
import { toObjectId } from '../../../util/objectId';

const handleGetRequest: RequestMethodHandler = async (req, res, db, client) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            const token = await getRequestToken(request);

            const query: Filter<Document> = {
                userId: toObjectId((token!.user as CredentialUser)._id),
                ...request.query,
            };

            const result = await db
                .collection(recipesCollection)
                .find(query, { sort: { name: 1 } })
                .toArray();

            if (!result) {
                response.status(StatusCodes.NOT_FOUND).json(null);
            } else {
                response.status(StatusCodes.OK).json(result);
            }
        },
    })(req, res, db, client);

const handlePostRequest: RequestMethodHandler = async (req, res, db, client) =>
    createMethodHandler({
        requireToken: true,
        requiredUserId: req.body.userId,
        callback: async (request, response) => {
            const result = await db.collection(recipesCollection).insertOne({
                ...request.body,
                userId: toObjectId(request.body.userId),
            });

            if (!result) {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR);
            } else {
                response
                    .status(StatusCodes.CREATED)
                    .json({ _id: result.insertedId });
            }
        },
    })(req, res, db, client);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.GET]: handleGetRequest,
    [RequestMethods.POST]: handlePostRequest,
};

export default createRootHandler(requestMethodHandlers);
