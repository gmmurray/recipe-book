import { FC, Fragment } from 'react';

import { Box } from '@mui/system';
import { CircularProgress } from '@mui/material';

type ContentWithStatusProps = {
    loading: boolean;
    empty: boolean;
    name: string;
    marginY: number;
};

const ContentWithStatus: FC<ContentWithStatusProps> = ({
    loading,
    empty,
    name,
    marginY,
    children,
}) => {
    if (loading) {
        return (
            <Box textAlign="center" my={marginY}>
                <CircularProgress />
            </Box>
        );
    } else if (empty) {
        return (
            <Box textAlign="center" my={marginY}>
                No {name} found
            </Box>
        );
    }
    return <Fragment>{children}</Fragment>;
};

export default ContentWithStatus;
