import ObjectID from 'bson-objectid';

//@ts-ignore
export const toObjectId = (value: string) => ObjectID(value);
