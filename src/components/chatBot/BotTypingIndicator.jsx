import { Box, Typography } from '@mui/material'

export const BotTypingIndicator = () => {
  return (
    <Box sx={{px:1}}>
      <Typography variant='caption' color='text.secondary'>
        El bot está escribiendo...
      </Typography>
    </Box>
  )
}
