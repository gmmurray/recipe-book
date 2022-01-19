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

            const $match: Filter<Document> = {
                $and: [
                    {
                        userId: toObjectId((token!.user as CredentialUser)._id),
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
                        request.query[key] !== 'undefined',
                )
                .forEach(key => {
                    if (
                        request.query[key] &&
                        request.query[key] !== 'undefined'
                    ) {
                        if (key === 'name' || key === 'notes') {
                            $or.push({
                                [key]: {
                                    $regex: request.query[key],
                                    $options: 'i',
                                },
                            });
                        } else if (key === 'categoryId') {
                            let categoryIdFilter: Filter<WithId<Document>> = {};

                            if (typeof request.query[key] === 'string') {
                                categoryIdFilter = {
                                    [key]:
                                        request.query[key] === 'null'
                                            ? null
                                            : toObjectId(
                                                  request.query[key] as string,
                                              ),
                                };
                            } else {
                                const ids = (
                                    request.query[key] as string[]
                                ).map(id =>
                                    id === 'null' ? null : toObjectId(id),
                                );
                                categoryIdFilter = {
                                    [key]: {
                                        $in: ids,
                                    },
                                };
                            }
                            $match['$and']!.push({ ...categoryIdFilter });
                        } else if (key === 'rating') {
                            $match['$and']!.push({
                                [key]: parseInt(request.query[key] as string),
                            });
                        } else {
                            $match['$and']!.push({ [key]: request.query[key] });
                        }
                    }
                });

            if ($or.length > 0) {
                $match['$and']!.push({ $or });
            }

            const aggPipeline: Document[] = [
                {
                    $match,
                },
                {
                    $lookup: {
                        from: categoriesCollection,
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                {
                    $sort: {
                        [request.query['sortField'] === 'category'
                            ? 'category.name'
                            : (request.query['sortField'] as string)]:
                            request.query['sortDir'] === 'asc' ? 1 : -1,
                    },
                },
            ];

            const aggCursor = db
                .collection(recipesCollection)
                .aggregate(aggPipeline);

            const aggResult: any[] = [];

            await aggCursor.forEach(item => {
                aggResult.push(item);
            });

            if (aggResult.length === 0) {
                response.status(StatusCodes.OK).json([]);
            } else {
                response.status(StatusCodes.OK).json(
                    aggResult.map(item => ({
                        ...item,
                        category: item.category[0] ?? null,
                    })),
                );
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
                createdAt: new Date(),
                categoryId: request.body.categoryId
                    ? toObjectId(request.body.categoryId)
                    : null,
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
