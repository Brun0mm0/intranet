import { ChatWindow } from './ChatWindow'
import { useChatBot } from '../../hooks/useChatBot'

export const ChatBotContainer = () => {
  const {messages, isTyping, sendMessage} = useChatBot() 
  return (
    <ChatWindow 
      messages={messages} 
      isTyping={isTyping} 
      onSendMessage={sendMessage} />
  )
}
