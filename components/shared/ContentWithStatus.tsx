import { CircularProgress, Typography } from '@mui/material';
import { FC, Fragment } from 'react';

import { Box } from '@mui/system';
import CancelIcon from '@mui/icons-material/Cancel';

type ContentWithStatusProps = {
    loading: boolean;
    empty: boolean;
    name: string;
    marginY: number;
    isSingle?: boolean;
};

const ContentWithStatus: FC<ContentWithStatusProps> = ({
    loading,
    empty,
    name,
    marginY,
    isSingle = false,
    children,
}) => {
    if (loading) {
        return (
            <Box textAlign="center" my={marginY}>
                <CircularProgress size="2.5rem" />
            </Box>
        );
    } else if (empty) {
        return (
            <Box textAlign="center" my={marginY}>
                <CancelIcon sx={{ fontSize: '2.5rem' }} />
                <Typography variant="h6">
                    {isSingle
                        ? `That ${name} could not be found`
                        : `No ${name} found`}
                </Typography>
            </Box>
        );
    }
    return <Fragment>{children}</Fragment>;
};

export default ContentWithStatus;
