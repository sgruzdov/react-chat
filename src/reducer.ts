import produce from 'immer'
import { DataType, MessageType, UserDataType } from './types'

export const JOINED = 'JOINED'
export const SET_USERS = 'SET_USERS'
export const NEW_MESSAGE = 'NEW_MESSAGE'
export const SET_DATA = 'SET_DATA'

export const initialState = {
    joined: false,
    roomId: '',
    userName: '',
    users: [''],
    messages: [{userName: '', text: ''}]
}

type InitialStateType = typeof initialState

export const reducer = (state: InitialStateType, action: ActionTypes): InitialStateType => {
    switch (action.type) {
        case JOINED:
            return produce(state, draft => {
                draft.joined = true
                draft.roomId = action.payload.roomId
                draft.userName = action.payload.userName
            })
        case SET_USERS:
            return produce(state, draft => {
                draft.users = action.payload
            })
        case SET_DATA:
            return produce(state, draft => {
                draft.users = action.payload.users
                draft.messages = action.payload.messages
            })
        case NEW_MESSAGE:
            return produce(state, draft => {
                draft.messages.push(action.payload)
            })
        default:
            return state
    }
}

type ActionTypes = JoinedType | SetUsersType | NewMessagesType | SetDataType

type JoinedType = {
    type: typeof JOINED
    payload: UserDataType
}

type SetUsersType = {
    type: typeof SET_USERS
    payload: string[]
}

type NewMessagesType = {
    type: typeof NEW_MESSAGE
    payload: MessageType
}

type SetDataType = {
    type: typeof SET_DATA
    payload: DataType
}