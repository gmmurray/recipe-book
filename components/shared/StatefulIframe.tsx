import { Box, CircularProgress, Fade, Typography } from '@mui/material';
import { FC, HTMLAttributes, useCallback, useState } from 'react';

import Cancel from '@mui/icons-material/Cancel';

type StatefulIframeProps = {
    url?: string;
    iframeStyles?: HTMLAttributes<HTMLIFrameElement>['style'];
    loadWarningText?: string;
    missingUrlErrorText: string;
};

const StatefulIframe: FC<StatefulIframeProps> = ({
    url,
    iframeStyles,
    loadWarningText,
    missingUrlErrorText,
}) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = useCallback((e: any) => {
        setIsLoading(false);
    }, []);

    if (!url) {
        return (
            <Box textAlign="center" my={5}>
                <Cancel sx={{ fontSize: '2.5rem' }} />
                <Typography variant="h6">{missingUrlErrorText}</Typography>
            </Box>
        );
    }

    return (
        <Box textAlign="center">
            {isLoading && <CircularProgress sx={{ my: 5 }} />}
            <Fade in={!isLoading} timeout={500}>
                <Box>
                    <iframe
                        src={url}
                        style={{
                            ...(iframeStyles ?? {}),
                        }}
                        onLoad={e => handleLoad(e)}
                    />
                    {!!loadWarningText && (
                        <Typography variant="subtitle2" color="text.secondary">
                            {loadWarningText}
                        </Typography>
                    )}
                </Box>
            </Fade>
        </Box>
    );
};

export default StatefulIframe;
