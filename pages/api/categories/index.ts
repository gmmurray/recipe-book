import {
    CreateRootHandlerParams,
    RequestMethodHandler,
    createMethodHandler,
    createRootHandler,
    getRequestToken,
} from '../../../util/requests';
import { Document, Filter, WithId } from 'mongodb';

import { CredentialUser } from '../../../entities/CredentialUser';
import { RequestMethods } from '../../../lib/constants/httpRequestMethods';
import { StatusCodes } from 'http-status-codes';
import { categoriesCollection } from '../../../entities/Category';
import { recipesCollection } from '../../../entities/Recipe';
import { toObjectId } from '../../../util/objectId';

const handleGetRequest: RequestMethodHandler = async (req, res, db, client) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            const token = await getRequestToken(request);
            const userId = toObjectId((token!.user as CredentialUser)._id);

            const $match: Filter<Document> = {
                $and: [
                    {
                        userId,
                    },
                ],
            };
            const $or: Filter<WithId<WithId<Document>>>[] = [];

            Object.keys(request.query)
                .filter(
                    key =>
                        key !== 'sortField' &&
                        key !== 'sortDir' &&
                        request.query[key] &&
                        request.query[key] !== undefined,
                )
                .forEach(key => {
                    switch (key) {
                        case 'name': {
                            $or.push({
                                [key]: {
                                    $regex: request.query[key],
                                    $options: 'i',
                                },
                            });
                            break;
                        }
                        default: {
                            return;
                        }
                    }
                });

            if ($or.length > 0) {
                $match['$and']!.push({ $or });
            }

            const sortField = request.query['sortField'] as string;
            const sortDir = request.query['sortDir'] === 'asc' ? 1 : -1;
            let resolvedSortField;
            let sortType;
            if (sortField === 'recipes') {
                sortType = '$sort';
                resolvedSortField = 'recipes';
            } else {
                sortType = '$sort';
                resolvedSortField = sortField;
            }

            const aggPipeline: Document[] = [
                {
                    $match,
                },
                {
                    $lookup: {
                        from: recipesCollection,
                        as: 'recipes',
                        let: { categoryId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    '$$categoryId',
                                                    '$categoryId',
                                                ],
                                            },
                                            {
                                                $eq: ['$userId', userId],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    [sortType]: {
                        [resolvedSortField]: sortDir,
                    },
                },
            ];

            const aggCursor = db
                .collection(categoriesCollection)
                .aggregate(aggPipeline);

            const aggResult: any[] = [];

            await aggCursor.forEach(item => {
                aggResult.push(item);
            });

            if (aggResult.length === 0) {
                response.status(StatusCodes.OK).json([]);
            } else {
                response.status(StatusCodes.OK).json(aggResult);
            }
        },
    })(req, res, db, client);

const handlePostRequest: RequestMethodHandler = async (req, res, db, client) =>
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
    })(req, res, db, client);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.GET]: handleGetRequest,
    [RequestMethods.POST]: handlePostRequest,
};

export default createRootHandler(requestMethodHandlers);
