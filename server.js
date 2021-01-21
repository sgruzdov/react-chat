const express = require('express')

const app = express()
const server = require('http').Server(app)
const socket = require('socket.io')(server, {cors: {origin: '*'}})

app.use(express.json())

const rooms = new Map()


app.get('/rooms/:id', (req, res) => {
    const roomId = req.params.id
    const obj = rooms.has(roomId) 
    ?   {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()]
        } 
    : { users: [], messages: [] }
    
    res.json(obj)
})

app.post('/rooms', (req, res) => {
    const {roomId, userName} = req.body

    if(!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.json()
})

socket.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users)
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if(value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()]
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users)
            }
        })
    })

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
        const obj = { userName, text }
        rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
    })

    console.log('user connected', socket.id)
})

server.listen(8888, err => {
    if(err) throw Error(err)
    console.log('Сервер запущен')
}) 