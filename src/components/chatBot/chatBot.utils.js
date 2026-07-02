// chatBot.utils.js

import { SENDER, MESSAGE_TYPE, MESSAGE_STATUS } from './chatBot.types';

/**
 * Matchea campos en dos variantes posibles que manda el bot:
 *  - "**Campo:** valor"   (dos puntos DENTRO de los asteriscos)
 *  - "**Campo**: valor"   (dos puntos FUERA de los asteriscos)
 * con o sin "- " adelante, sin depender de saltos de línea reales.
 */
const FIELD_REGEX = /-?\s*\*\*(.+?)(:?)\*\*:?\s*([\s\S]*?)(?=\s*-\s*\*\*|$)/g;

/**
 * Parsea un texto con campos tipo "**Campo**: valor - **Campo2:** valor2"
 * y devuelve un objeto { Campo: valor, Campo2: valor2 }, o null si no
 * encuentra ningún campo (mensaje conversacional normal).
 */
export const parseStructuredFields = (text) => {
  if (!text) return null;

  const matches = [...text.matchAll(FIELD_REGEX)];
  if (matches.length === 0) return null;

  const fields = {};
  matches.forEach((m) => {
    const key = m[1].replace(/:$/, '').trim();
    const value = m[3].trim();
    if (key && value) fields[key] = value;
  });

  return Object.keys(fields).length > 0 ? fields : null;
};

/**
 * Separa intro / campos de una respuesta del bot.
 *
 * Nota: no separamos un "outro" porque el bot no usa ningún delimitador
 * confiable entre el último valor y el texto de cierre conversacional
 * (a veces van pegados sin punto ni salto de línea). Ese texto de cierre
 * queda incluido como parte del valor del último campo. Si en el futuro
 * el bot puede mandar los datos en un bloque separado (ej. JSON o con
 * saltos de línea reales), conviene resolverlo ahí en vez de acá.
 */
export const parseBotContent = (text) => {
  const fields = parseStructuredFields(text);
  if (!fields) return { intro: text, fields: null };

  const firstFieldIndex = text.indexOf('**');
  const intro =
    firstFieldIndex > 0
      ? text.slice(0, firstFieldIndex).replace(/[-:]\s*$/, '').trim()
      : '';

  return { intro, fields };
};

/**
 * Genera un ID simple (podés cambiarlo por uuid si querés algo más robusto)
 */
export const generateId = () => `${Date.now()}-${Math.random()}`;

/**
 * Factory base de mensaje
 */
const createBaseMessage = ({
  sender,
  content,
  type = MESSAGE_TYPE.TEXT,
  status = MESSAGE_STATUS.SENT,
  parsed=null
}) => ({
  id: generateId(),
  sender,
  content,
  type,
  timestamp: Date.now(),
  status,
  parsed
});

/**
 * Mensaje del usuario
 */
export const createUserMessage = (content) =>
  createBaseMessage({
    sender: SENDER.USER,
    content,
    status: MESSAGE_STATUS.SENDING,
  });

/**
 * Mensaje del bot.
 * Si el contenido tiene campos estructurados (**Campo**: valor),
 * el resultado parseado queda en message.parsed; si no, parsed es null
 * y el mensaje se renderiza como texto plano.
 */
export const createBotMessage = (content) => {
  const parsed = parseBotContent(content);
  return createBaseMessage({
    sender: SENDER.BOT,
    content,
    parsed: parsed.fields ? parsed : null,
  });
};

/**
 * Mensaje de error
 */
export const createErrorMessage = (content = 'Ocurrió un error') =>
  createBaseMessage({
    sender: SENDER.BOT,
    content,
    type: MESSAGE_TYPE.ERROR,
    status: MESSAGE_STATUS.ERROR,
  });

/**
 * Marca un mensaje como enviado
 */
export const markMessageAsSent = (message) => ({
  ...message,
  status: MESSAGE_STATUS.SENT,
});

// Botón de descarga de PDF
export const createPDFMessage = (base64, filename, mime) => ({
  id: Date.now(),
  sender: SENDER.BOT,
  type: MESSAGE_TYPE.PDF,
  content: null,
  pdf: { base64, filename, mime },
  timestamp: new Date().toISOString(),
  status: 'sent',
});
