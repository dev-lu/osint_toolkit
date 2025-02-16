import React from 'react';
import { Card, Stack, TextField, Button, LinearProgress } from '@mui/material';

const InputCard = ({
  inputId,
  inputLabel,
  buttonLabel,
  callType,
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
}) => {
  return (
    <Stack>
      <Card sx={cardStyle}>
        <TextField
          id={inputId}
          label={inputLabel}
          InputProps={{
            style: {
              borderRadius: 1,
              mb: 2
            }
          }}
          fullWidth
          multiline
          rows={10}
          sx={{mb: 2}}
        />
        <Stack spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            align="center"
            disableElevation
            size="large"
            type="submit"
            sx={{ borderRadius: 1, mt: 2, ml: 1 }}
            onClick={() =>
              callOpenAI(
                document.getElementById(inputId).value,
                callType
              )
            }
          >
            <Stack spacing={2} justifyContent="center">
              {`Send ${buttonLabel.toLowerCase()} to OpenAI`}
              {loading ? <LinearProgress color="inherit" /> : null}
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
};

export default InputCard;
