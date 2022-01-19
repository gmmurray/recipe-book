export const createEndpoint = (base: string, identifier?: string | null) =>
    `${base}/${identifier ? identifier : ''}`;

export const createQueryEndpoint = (
    base: string,
    query?: Record<string, any> | null,
) => {
    if (
        query &&
        Object.keys(query).some(
            key => query[key] !== undefined && query[key] !== null,
        )
    ) {
        console.log(query);
        const arrayParams = Object.keys(query).filter(key =>
            Array.isArray(query[key]),
        );
        let arrayString = '';

        let result = base;
        if (result[result.length - 1] !== '?') {
            result += '?';
        }

        arrayParams.forEach(key => {
            (query[key] as string[]).forEach(
                value => (arrayString += `&${key}=${value}`),
            );
            query[key] = undefined;
        });

        const cleanQuery: Record<string, any> = {};

        Object.keys(query).forEach(key => {
            if (query[key] !== undefined) {
                cleanQuery[key] = query[key];
            }
        });

        if (
            Object.keys(cleanQuery).some(key =>
                arrayParams.some(k => k !== key),
            )
        ) {
            arrayString = '&' + arrayString;
        } else {
            arrayString = arrayString.substring(1);
        }

        return result + new URLSearchParams(cleanQuery) + arrayString;
    }

    return base;
};
