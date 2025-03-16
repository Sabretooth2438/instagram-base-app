import { useState, useEffect } from 'react'
import { ref, push, onValue } from 'firebase/database'
import { database } from '../firebase' // Ensure correct import path

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const messagesRef = ref(database, 'messages')

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const messageArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => a.timestamp - b.timestamp) // Ensure correct order

        setMessages(messageArray)
      } else {
        setMessages([])
      }
    })

    return () => unsubscribe() // Cleanup listener on unmount
  }, [])

  const sendMessage = () => {
    if (message.trim() === '') return

    push(ref(database, 'messages'), {
      text: message,
      sender: user ? user.email : 'Anonymous',
      timestamp: Date.now(),
    })

    setMessage('')
  }

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat Room</h1>
      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const formattedTime = new Date(msg.timestamp).toLocaleTimeString()
            return (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.sender === (user ? user.email : '') ? 'self' : ''
                }`}
              >
                <p className="chat-sender">
                  {msg.sender}{' '}
                  <span className="chat-time">{formattedTime}</span>
                </p>
                <p className="chat-text">{msg.text}</p>
              </div>
            )
          })
        ) : (
          <p className="no-messages">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default Chat
