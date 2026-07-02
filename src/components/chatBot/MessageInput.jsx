import { useState } from 'react'
import { Box, TextField, IconButton } from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded';

export const MessageInput = ({onSendMessage}) => {

  const [value, setValue] = useState('')

  const handleSend = () => {
    if(!value.trim()) return;

    onSendMessage(value);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{display: 'flex', gap: 1, padding: 1}}
      >
      <TextField
        fullWidth
        size='small'
        placeholder='Escribe tu mensaje...'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton color='primary' onClick={handleSend}>
        <SendRoundedIcon />
      </IconButton>
    </Box>
  )
}
