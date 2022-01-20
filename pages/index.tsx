import { Container, Typography } from '@mui/material';

import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
    const { data: session } = useSession();
    return (
        <Container maxWidth="xl">
            <Typography variant="h1">Welcome</Typography>
        </Container>
    );
};

export default Home;
