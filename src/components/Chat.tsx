import React, { useState, useRef, useEffect } from 'react'

import socket from '../socket'
import { MessageType } from '../types'

type PropsType = {
    users: string[]
    messages: MessageType[]
    userName: string
    roomId: string
    onAddMessage: (obj: MessageType) => void
}

const Chat: React.FC<PropsType> = ({ users, messages, userName, roomId, onAddMessage }) => {
    const [messageValue, setMessageValue] = useState('')
    const messagesRef = useRef(null)

    const onSendMessage = () => {
        socket.emit('ROOM:NEW_MESSAGE', { userName, roomId, text: messageValue })
        setMessageValue('')
        onAddMessage({ userName, text: messageValue })
    }

    useEffect(() => {
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight)
    }, [messages])

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>{roomId}</b>
                <hr />
                <b>Онлайн ({users.length}):</b>
                <ul>
                    {users.map((name, index) => (
                    <li key={name + index}>{name}</li>
                    ))}
                </ul>
            </div>
            <div className="chat-messages">
            <div ref={messagesRef} className="messages">
                {messages.map((message, index) => (
                <div className={`message ${userName === message.userName ? 'my' : ''}`} key={index}>
                    <p>{message.text}</p>
                    <div>
                    <span>{message.userName}</span>
                    </div>
                </div>
                ))}
            </div>
            <form>
                <textarea 
                    className="form-control" 
                    value={messageValue} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageValue(e.target.value)}
                ></textarea>
                <button onClick={onSendMessage} type="button" className="btn btn-primary">Отправить</button>
            </form>
            </div>
        </div>
    )
}

export default Chat
