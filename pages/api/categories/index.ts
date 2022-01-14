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
import { categoriesCollection } from '../../../entities/Category';
import { toObjectId } from '../../../util/objectId';

const handleGetRequest: RequestMethodHandler = async (req, res, db) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            const token = await getRequestToken(request);
            const { name } = request.query;
            let resolvedName = undefined;
            if (name) {
                resolvedName = typeof name === 'string' ? name : name[0];
            }

            const query: Filter<Document> = {
                userId: toObjectId((token!.user as CredentialUser)._id),
            };

            if (resolvedName) {
                query.name = {
                    $regex: resolvedName,
                    $options: 'i',
                };
            }

            const result = await db
                .collection(categoriesCollection)
                .find(query, { sort: { name: 1 } })
                .toArray();

            if (!result) response.status(StatusCodes.NOT_FOUND).json(null);
            else response.status(StatusCodes.OK).json(result);
        },
    })(req, res, db);

const handlePostRequest: RequestMethodHandler = async (req, res, db) =>
    createMethodHandler({
        requireToken: true,
        requiredUserId: req.body.userId,
        callback: async (request, response) => {
            const result = await db.collection(categoriesCollection).insertOne({
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
    })(req, res, db);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.GET]: handleGetRequest,
    [RequestMethods.POST]: handlePostRequest,
};

export default createRootHandler(requestMethodHandlers);
