import { compare, genSalt, hash } from 'bcrypt';

export const hashString = async (input: string) => {
    const salt = await genSalt(
        parseInt(process.env.HASH_SALT_ROUNDS ?? '') ?? undefined,
    );
    return await hash(input, salt);
};

export const isMatchingHashString = async (
    input: string,
    hashString: string,
) => {
    return await compare(input, hashString);
};
