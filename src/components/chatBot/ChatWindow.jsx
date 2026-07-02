import { useState } from 'react';
import { Box, Paper, Typography, Divider, IconButton } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { BotTypingIndicator } from './BotTypingIndicator';

export const ChatWindow = ({ messages, isTyping, onSendMessage }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      {/* Panel expandido */}
      <Paper
        elevation={3}
        sx={{
          width: open ? 350 : 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'width 0.25s ease',
        }}
      >
        {open && (
          <>
            {/* Header */}
            <Box
              sx={{
                paddingX: 2,
                paddingY: 0.5,
                bgcolor: '#009ADA',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="subtitle1">ChatBot</Typography>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: 'inherit' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Divider />

            {/* Area de mensajes */}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: 1 }}>
              <MessageList messages={messages} />
              {isTyping && <BotTypingIndicator />}
            </Box>
            <Divider />

            {/* Input de mensaje */}
            <Box>
              <MessageInput onSendMessage={onSendMessage} />
            </Box>
          </>
        )}
      </Paper>

      {/* Pestaña colapsada */}
      {!open && (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            width: 40,
            bgcolor: '#009ADA',
            color: 'primary.contrastText',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 2,
            cursor: 'pointer',
            borderRadius: 2,
            gap: 1,
          }}
        >
          <ChatBubbleOutlineIcon />
          <Typography
            variant="subtitle1"
            sx={{
              writingMode: 'vertical-rl',
              userSelect: 'none',
            }}
          >
            ChatBot
          </Typography>
        </Box>
      )}
    </Box>
  );
};