import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import clientPromise from '../../../config/mongoAdapter';
import { isMatchingHashString } from '../../../util/hash';

const nextAuth = NextAuth({
    pages: {
        signIn: '/welcome',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            name: 'Username/Password',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const { username, password } = credentials ?? {};

                if (!username || !password) {
                    return null;
                }

                const db = (await clientPromise).db();
                const user = await db
                    .collection('credentialUsers')
                    .findOne({ username });

                if (
                    user &&
                    isMatchingHashString(password, user.password ?? '')
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.AUTH_SECRET,
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    callbacks: {
        //@ts-ignore
        jwt: async ({ token, user }) => {
            if (user) {
                token.user = user;
            }
            return token;
        },
        // @ts-ignore
        session: async ({ token }) => {
            return Promise.resolve({ user: token.user ?? null });
        },
    },
});

export default nextAuth;
