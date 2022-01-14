const isRequiredString = (name: string) => `${name} is required`;

export const isRequired = (name: string) => (value: any) =>
    value ? undefined : isRequiredString(name);

export const isMinLength = (name: string, length: number) => (value: string) =>
    value.length >= length
        ? undefined
        : `${name} must be at least ${length} character(s) long`;

export const isMatchingValue =
    (name: string, valueToMatch: any) => (value: any) =>
        valueToMatch === value ? undefined : `${name} must match`;

export const composeValidators =
    (...validators: any[]) =>
    (value: any) =>
        validators.reduce(
            (error, validator) => error || validator(value),
            undefined,
        );
