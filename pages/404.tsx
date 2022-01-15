import { Button, Grid, Typography } from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import Link from 'next/link';

const PageNotFound = () => {
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 'calc(100vh - 68.5px)', textAlign: 'center' }}
        >
            <Grid item xs={3}>
                <CancelIcon sx={{ fontSize: '5rem' }} />
                <Typography variant="h6" gutterBottom>
                    The page you are looking for could not be found
                </Typography>
                <Link href="/" passHref>
                    <Button color="inherit" variant="outlined">
                        Home
                    </Button>
                </Link>
            </Grid>
        </Grid>
    );
};

export default PageNotFound;
