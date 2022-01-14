import { CreateCredentialUser } from '../../entities/CredentialUser';
import { axiosPostRequest } from '../../config/axios';
import { useMutation } from 'react-query';

export const credentialUsersQueryKeys = {
    all: 'users' as const,
};

const apiEndpoint = 'api/users/credentials';

const createCredentialUser = async (data: Partial<CreateCredentialUser>) =>
    await axiosPostRequest(apiEndpoint, data);
export const useCreateCredentialUser = () =>
    useMutation((data: Partial<CreateCredentialUser>) =>
        createCredentialUser(data),
    );
