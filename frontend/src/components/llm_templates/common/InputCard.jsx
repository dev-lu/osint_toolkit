import { Card, Stack, TextField, Button, LinearProgress } from '@mui/material';

const InputCard = ({
    inputId,
    inputLabel,
    buttonLabel,
    callOpenAI,
    loading,
    cardStyle,
    apiKeys,
    buttonClicked,
    result,
    NoApikeys,
    ResultCard,
    Introduction,
    moduleName
}) => (
    <Stack>
        <Card sx={cardStyle}>
            <TextField
                id={inputId}
                label={inputLabel}
                fullWidth
                multiline
                rows={10}
                sx={{ mb: 2, borderRadius: 1 }}
            />
            <Stack spacing={2} justifyContent="center">
                <Button
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 1 }}
                    onClick={() =>
                        callOpenAI(
                            document.getElementById(inputId).value
                        )
                    }
                >
                    <Stack spacing={2} justifyContent="center">
                        {`Send ${buttonLabel.toLowerCase()} to OpenAI`}
                        {loading && <LinearProgress color="inherit" />}
                    </Stack>
                </Button>
            </Stack>
        </Card>

        {!apiKeys.openai && buttonClicked ? (
            <NoApikeys />
        ) : result ? (
            <ResultCard answer={result} />
        ) : (
            <Introduction moduleName={moduleName} />
        )}
    </Stack>
);

export default InputCard;
