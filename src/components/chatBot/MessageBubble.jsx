import { Box, Typography, Button, Stack } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { SENDER, MESSAGE_TYPE } from "./chatBot.types";

export const MessageBubble = ({ message }) => {
  const isUser = message.sender === SENDER.USER;
  const isPdf = message.type === MESSAGE_TYPE.PDF;
  const isStructured = !isUser && !isPdf && message.parsed;

  const handleDownload = () => {
    const { base64, filename, mime } = message.pdf;
    const link = document.createElement("a");
    link.href = `data:${mime};base64,${base64}`;
    link.download = filename;
    link.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}>
      <Box
        sx={{
          maxWidth: '100%',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: isUser ? '#009ADA' : 'grey.300',
          color: isUser ? 'primary.contrastText' : 'text.primary',
        }}>
        {isPdf ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{ textTransform: "none" }}
          >
            Descargar {message.pdf.filename}
          </Button>
        ) : isStructured ? (
          <Box>
            {message.parsed.intro && (
              <Typography variant="body2" sx={{ mb: 1 }}>
                {message.parsed.intro}
              </Typography>
            )}

            <Stack
              component="dl"
              spacing={0.5}
              sx={{
                // bgcolor: 'background.paper',
                borderRadius: 1,
                p: 1,
                m: 0,
              }}
            >
              {Object.entries(message.parsed.fields).map(([key, value]) => (
                <Stack key={key} direction="row" spacing={1}>
                  <Typography
                    component="dt"
                    variant="body2"
                    sx={{ fontWeight: 600, minWidth: 130 }}
                  >
                    {key}:
                  </Typography>
                  <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                    {value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        ) : (
          <Typography variant='body2'>{message.content}</Typography>
        )}

        {/* Estado del mensaje
        {isUser && message.status === 'sending' && (
          <Typography variant='caption' sx={{ opacity: 0.7 }}>
            Enviando...
          </Typography>
        )} */}
      </Box>
    </Box>
  );
};
