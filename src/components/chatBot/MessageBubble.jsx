import { Box, Typography, Button, Stack } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { SENDER, MESSAGE_TYPE } from "./chatBot.types";
import { PDFDocument } from "pdf-lib";

export const MessageBubble = ({ message }) => {
  const isUser = message.sender === SENDER.USER;
  const isPdf = message.type === MESSAGE_TYPE.PDF;
  const isStructured = !isUser && !isPdf && message.parsed;

  // 🔹 Helpers de conversión base64 <-> bytes (pdf-lib trabaja con Uint8Array)
const base64ToUint8Array = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const uint8ArrayToBase64 = (bytes) => {
  let binary = "";
  const chunkSize = 0x8000; // evita desbordar el stack con PDFs grandes
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

 const handleDownload = async () => {
  const { base64, filename, mime } = message.pdf;

  try {
    const pdfBytes = base64ToUint8Array(base64);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // ✅ Convierte los campos de formulario en contenido estático —
    // ya no se pueden volver a editar desde un lector de PDF.
    const form = pdfDoc.getForm();
    form.flatten();

    const flattenedBytes = await pdfDoc.save();
    const flattenedBase64 = uint8ArrayToBase64(flattenedBytes);

    const link = document.createElement("a");
    link.href = `data:${mime};base64,${flattenedBase64}`;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error("Error al aplanar el PDF:", error);
    // Fallback: si algo falla al aplanar, descarga el original tal cual
    // vino, en vez de dejar al usuario sin poder descargar nada.
    const link = document.createElement("a");
    link.href = `data:${mime};base64,${base64}`;
    link.download = filename;
    link.click();
  }
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
