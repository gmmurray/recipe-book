import { NextApiRequest } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const resolveQueryParam = (query: ParsedUrlQuery, key: string) => {
    const raw = query[key];
    return !!raw ? (typeof raw === 'string' ? raw : raw[0]) : null;
};

export const resolveApiQueryParam = (
    query: NextApiRequest['query'],
    key: string,
) => {
    const value = query[key];
    return typeof value === 'string' ? value : value[0];
};
