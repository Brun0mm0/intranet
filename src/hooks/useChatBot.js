import { useState } from 'react';
import {
  createUserMessage,
  createBotMessage,
  createErrorMessage,
  markMessageAsSent,
  createPDFMessage
} from '../components/chatBot/';
import chatBotApi from '../api/chatBotApi';
import { useSessionState } from './useSessionState';

export const useChatBot = () => {
  const [sessionId, setSessionId] = useSessionState('session_id', null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    setError(null);

    const userMessage = createUserMessage(text);
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsTyping(true);

      const response = await chatBotApi.post('chat/', {
        message: text,
        session_id: sessionId,
      });

      if (response.data.session_id) {
        setSessionId(response.data.session_id);
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? markMessageAsSent(msg) : msg
        )
      );

      const { reply, credencial_pdf_base64, filename, mime } = response.data;

      const newMessages = [];

      if (reply) {
        const botMsg = createBotMessage(reply);
        newMessages.push(botMsg);
      }

      if (credencial_pdf_base64) newMessages.push(createPDFMessage(credencial_pdf_base64, filename, mime));

      setMessages((prev) => [...prev, ...newMessages]);

    } catch (err) {
      console.error(err);
      setError('Error al comunicarse con el bot');
      setMessages((prev) => [...prev, createErrorMessage('Hubo un problema al obtener respuesta')]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setError(null);
    setIsTyping(false);
  };

  return { messages, isTyping, error, sendMessage, resetChat };
};