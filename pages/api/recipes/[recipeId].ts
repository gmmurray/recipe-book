import {
    CreateRootHandlerParams,
    RequestMethodHandler,
    createMethodHandler,
    createRootHandler,
    getRequestToken,
} from '../../../util/requests';

import { CredentialUser } from '../../../entities/CredentialUser';
import { RequestMethods } from '../../../lib/constants/httpRequestMethods';
import { StatusCodes } from 'http-status-codes';
import { recipesCollection } from '../../../entities/Recipe';
import { resolveApiQueryParam } from '../../../util/resolveQueryParam';
import { toObjectId } from '../../../util/objectId';

const handleGetRequest: RequestMethodHandler = async (req, res, db, client) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            const token = await getRequestToken(request);

            const result = await db.collection(recipesCollection).findOne({
                _id: toObjectId(
                    resolveApiQueryParam(request.query, 'recipeId'),
                ),
                userId: toObjectId((token!.user as CredentialUser)._id),
            });

            if (!result) {
                response.status(StatusCodes.NOT_FOUND).json(null);
            } else {
                response.status(StatusCodes.OK).json(result);
            }
        },
    })(req, res, db, client);

const handlePutRequest: RequestMethodHandler = async (req, res, db, client) =>
    createMethodHandler({
        requireToken: true,
        requiredUserId: req.body.userId,
        callback: async (request, response) => {
            const token = await getRequestToken(request);
            const userId = toObjectId((token!.user as CredentialUser)._id);

            const {
                _id: removedId,
                userId: removedUserId,
                ...updates
            } = request.body;

            const result = await db
                .collection(recipesCollection)
                .findOneAndUpdate(
                    {
                        _id: toObjectId(
                            resolveApiQueryParam(request.query, 'recipeId'),
                        ),
                        userId,
                    },
                    {
                        $set: {
                            ...updates,
                            categoryId: toObjectId(updates.categoryId),
                        },
                    },
                );

            if (result.ok) {
                response.status(StatusCodes.NO_CONTENT).json(null);
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(null);
            }
        },
    })(req, res, db, client);

const handleDeleteRequest: RequestMethodHandler = async (
    req,
    res,
    db,
    client,
) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            const token = await getRequestToken(request);
            const userId = toObjectId((token!.user as CredentialUser)._id);

            const recipeId = toObjectId(
                resolveApiQueryParam(request.query, 'recipeId'),
            );

            await db.collection(recipesCollection).findOneAndDelete({
                _id: recipeId,
                userId,
            });

            response.status(StatusCodes.NO_CONTENT).json(null);
        },
    })(req, res, db, client);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.GET]: handleGetRequest,
    [RequestMethods.PUT]: handlePutRequest,
    [RequestMethods.DELETE]: handleDeleteRequest,
};

export default createRootHandler(requestMethodHandlers);
