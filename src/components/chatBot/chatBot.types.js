export const SENDER = {
    USER: 'user',
    BOT: 'bot',
};

export const MESSAGE_TYPE = {
    TEXT: 'text',
    PDF: 'pdf',
    ERROR: 'error',
    SYSTEM: 'system',
};

export const MESSAGE_STATUS = {
    SENDING: 'sending',
    SENT: 'sent',
    ERROR: 'error',
};

/**
 * Message
 * @typedef {Object} Message
 * @property {string} id
 * @property {'user' | 'bot'} sender
 * @property {string} content
 * @property {'text' | 'error' | 'system'} type
 * @property {number} timestamp
 * @property {'sending' | 'sent' | 'error'} [status]@property {{intro: string, fields: Object, outro: string} | null} [parsed]
 * @property {{base64: string, filename: string, mime: string}} [pdf]
 */