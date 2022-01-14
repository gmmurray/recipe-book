import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes, getReasonPhrase } from 'http-status-codes';

import { CredentialUser } from '../entities/CredentialUser';
import { Db } from 'mongodb';
import { RequestMethods } from '../lib/constants/httpRequestMethods';
import clientPromise from '../config/mongoAdapter';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

export const getRequestToken = async (req: NextApiRequest) =>
    await getToken({ req, secret: JWT_SECRET });

export type RequestMethodHandler = (
    req: NextApiRequest,
    res: NextApiResponse,
    db: Db,
) => Promise<any>;

type RootHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export type CreateRootHandlerParams =
    | Record<string, RequestMethodHandler>
    | Record<string, undefined>;

type CreateRootHandlerType = (params: CreateRootHandlerParams) => RootHandler;
export const createRootHandler: CreateRootHandlerType =
    params => async (req, res) => {
        const db = (await clientPromise).db();
        switch (req.method) {
            case RequestMethods.GET: {
                if (params.GET) return params.GET(req, res, db);
            }
            case RequestMethods.POST: {
                if (params.POST) return params.POST(req, res, db);
            }
            case RequestMethods.PATCH: {
                if (params.PATCH) return params.PATCH(req, res, db);
            }
            case RequestMethods.PUT: {
                if (params.PUT) return params.PUT(req, res, db);
            }
            case RequestMethods.DELETE: {
                if (params.DELETE) return params.DELETE(req, res, db);
            }
            default:
                throw new Error(ReasonPhrases.NOT_IMPLEMENTED);
        }
    };

export type CreateMethodHandlerParams = {
    callback: RequestMethodHandler;
    requireToken: boolean;
    requiredUserId?: string;
};

type CreateMethodHandlerType = (
    params: CreateMethodHandlerParams,
) => RequestMethodHandler;
export const createMethodHandler: CreateMethodHandlerType =
    ({ callback, requireToken, requiredUserId }) =>
    async (req, res, db) => {
        try {
            const token = await getToken({ req, secret: JWT_SECRET });

            const isAuthenticated = requireToken
                ? requireToken && !!token
                : true;

            const isAuthorized = requiredUserId
                ? requiredUserId &&
                  (token?.user as CredentialUser)?._id === requiredUserId
                : true;

            if (isAuthenticated && isAuthorized) {
                await callback(req, res, db);
            } else {
                res.status(StatusCodes.UNAUTHORIZED).json(null);
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
            });
        }
    };
