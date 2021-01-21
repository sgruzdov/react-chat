import React, { useState } from 'react'
import axios from 'axios'
import { UserDataType } from '../types'


type PropsType = {
    onLogin: (obj: UserDataType) => void
}


const JoinBlock: React.FC<PropsType> = ({ onLogin }) => {
    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onEnter = async () => {
        if(!roomId || !userName) {
            return alert('Введите все данные')
        }
        setIsLoading(true)
        try {
            const obj = { roomId, userName }
            await axios.post('/rooms', obj)
            setIsLoading(false)
            onLogin(obj)
        } catch(e) {
            console.log(e)
        }

    }

    return (
        <div className="join-block">
            <input type="text" placeholder="Poom ID" value={roomId} onChange={e => setRoomId(e.target.value)}/>
            <input type="text" placeholder="Ваше имя" value={userName} onChange={e => setUserName(e.target.value)}/>
            <button className="btn btn-success" disabled={isLoading} onClick={onEnter}>{isLoading ? 'Вход...' : 'Войти'}</button>
        </div>
    )
}

export default JoinBlock
