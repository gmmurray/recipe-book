import {
    CreateRootHandlerParams,
    RequestMethodHandler,
    createMethodHandler,
    createRootHandler,
} from '../../../util/requests';

import { RequestMethods } from '../../../lib/constants/httpRequestMethods';
import { StatusCodes } from 'http-status-codes';
import { categoriesCollection } from '../../../entities/Category';
import { resolveApiQueryParam } from '../../../util/resolveQueryParam';
import { toObjectId } from '../../../util/objectId';

const handleDeleteRequest: RequestMethodHandler = async (req, res, db) =>
    createMethodHandler({
        requireToken: true,
        callback: async (request, response) => {
            await db
                .collection(categoriesCollection)
                .findOneAndDelete({
                    _id: toObjectId(
                        resolveApiQueryParam(request.query, 'categoryId'),
                    ),
                });
            response.status(StatusCodes.NO_CONTENT).json(null);
        },
    })(req, res, db);

const requestMethodHandlers: CreateRootHandlerParams = {
    [RequestMethods.DELETE]: handleDeleteRequest,
};

export default createRootHandler(requestMethodHandlers);
