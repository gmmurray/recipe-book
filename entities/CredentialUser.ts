export interface CredentialUser {
    _id: string; // stored as objectid in db
    username: string;
    password: string;
}

export interface CreateCredentialUser extends CredentialUser {
    confirmPassword: string;
}

export const credentialUsersCollection = 'credentialUsers';
