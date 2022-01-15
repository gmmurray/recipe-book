export const createEndpoint = (base: string, identifier?: string | null) =>
    `${base}/${identifier ? identifier : ''}`;

export const createQueryEndpoint = (
    base: string,
    query?: Record<string, any> | null,
) => {
    if (query && Object.keys(query).some(key => !!query[key])) {
        let result = base;
        if (result[result.length - 1] !== '?') {
            result += '?';
        }

        return result + new URLSearchParams(query);
    }

    return base;
};
