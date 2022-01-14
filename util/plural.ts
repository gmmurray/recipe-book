export const pluralize = (length: number, singular: string, plural: string) => {
    if (length === 1) {
        return singular;
    }
    return plural;
};

export const pluralCountText = (
    singular: string,
    plural: string,
    items?: any[] | null,
) => {
    const count = (items ?? []).length;
    return `${count} ${pluralize(count, singular, plural)}`;
};
