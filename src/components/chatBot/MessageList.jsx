import { Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

export const MessageList = ({messages}) => {
  const bottomRef = useRef(null);
  // 🔽 Auto scroll al ultimo mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});  
  }, [messages]);

  return (
    <Stack spacing={1}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {/* Elemento invisible para hacer scroll al final de la lista */}
      <div ref={bottomRef} />
    </Stack>

  )
}
