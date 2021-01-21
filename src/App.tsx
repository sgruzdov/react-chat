import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

import Chat from './components/Chat'
import JoinBlock from './components/JoinBlock'
import { initialState, reducer, JOINED, SET_USERS, NEW_MESSAGE, SET_DATA } from './reducer'
import socket from './socket'
import { MessageType, UserDataType } from './types'



const App:React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const setUsers = (users: string[]): void => dispatch({ type: SET_USERS, payload: users })

    const onLogin = async (obj: UserDataType): Promise<void> => {
        dispatch({ type: JOINED, payload: obj })
        socket.emit('ROOM:JOIN', obj)
        try {
            const { data } = await axios.get(`/rooms/${obj.roomId}`)
            dispatch({ type: SET_DATA, payload: data })
        } catch(e) {
            console.log(e)
        }
    }

    const addMessage = (obj: MessageType): void => {
        dispatch({ type: NEW_MESSAGE, payload: obj })
    }

    useEffect(() => {
        socket.on('ROOM:SET_USERS', setUsers)
        socket.on('ROOM:NEW_MESSAGE', addMessage)
    }, [])

    return (
        <div className="wrapper">
            {!state.joined
                ? <JoinBlock onLogin={onLogin} />
                : <Chat 
                    users={state.users} 
                    messages={state.messages} 
                    userName={state.userName} 
                    roomId={state.roomId}
                    onAddMessage={addMessage} />
            }
        </div>
    )
}

export default App
