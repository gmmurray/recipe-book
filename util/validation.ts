const isRequiredString = (name: string) => `${name} is required`;

export const isEmptyString = (value: any) =>
    typeof value === 'string' && value.length === 0;

export const isRequired = (name: string) => (value: any) =>
    value ? undefined : isRequiredString(name);

export const isMinLength = (name: string, length: number) => (value: string) =>
    value.length >= length
        ? undefined
        : `${name} must be at least ${length} character(s) long`;

export const isMaxLength = (name: string, length: number) => (value: string) =>
    (value?.length ?? 0) <= length
        ? undefined
        : `${name} must be less than ${length} character(s) long`;

export const isMatchingValue =
    (name: string, valueToMatch: any) => (value: any) =>
        valueToMatch === value ? undefined : `${name} must match`;

export const isValidUrl = (name: string) => (value: any) => {
    if (value && typeof value === 'string' && !isEmptyString(value)) {
        return value.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        )
            ? undefined
            : `${name} must be a valid url`;
    }
};

export const composeValidators =
    (...validators: any[]) =>
    (value: any) =>
        validators.reduce(
            (error, validator) => error || validator(value),
            undefined,
        );
