export type UserDataType = {
    roomId: string
    userName: string
}

export type MessageType = {
    userName: string
    text: string
}

export type DataType = {
    users: string[]
    messages: MessageType[]
}