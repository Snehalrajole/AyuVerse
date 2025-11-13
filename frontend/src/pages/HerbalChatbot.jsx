import { motion } from 'framer-motion'
import './HerbalChatbot.css'

const HerbalChatbot = () => {
  return (
    <div className="herbal-chatbot">
      <motion.div
        className="chatbot-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="chatbot-header">
          <h1>Herbal Chatbot</h1>
          <p>Your AI Ayurvedic assistant</p>
        </div>
        
        <div className="chatbot-content">
          <div className="chatbot-illustration">
            <div className="bot-icon">🤖</div>
            <p>Ask me anything about Ayurvedic plants and remedies!</p>
          </div>
          
          <div className="chat-interface">
            <div className="chat-messages">
              <div className="message bot-message">
                <div className="message-content">
                  <p>Hello! I'm your Ayurvedic assistant. How can I help you today?</p>
                </div>
              </div>
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Type your question..."
                className="chat-input"
              />
              <button className="send-button">Send</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HerbalChatbot
