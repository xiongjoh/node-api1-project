const express = require('express')
const shortid = require('shortid')

const server = express()

server.use(express.json())

// our fake db
let users = [
    {
        id: shortid.generate(), name: "Jane Doe", bio:"Not Tarzan's Wife, another Jane",
    }
]

// helper functions to interact with the user database
const User = {
    createNew(user) {
        const newUser = {id: shortid.generate(), ...user}
        user.push(newUser)
        return newUser
    },
    getAll() {

    },
    getById(id) {

    },
    update(id, changes) {

    },
    delete(id) {

    },
}

// endpoints for users
server.post('/api/users', (req, res) => {
    const clientUser = req.body

    if (!clientUser.name || !clientUser.bio) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        return
    }

    const newUser = User.createNew(clientUser)

    res.status(201).json(newUser)
})
server.get('/api/users')
server.get('/api/users/:id')
server.delete('/api/users/:id')
server.put('/api/users/:id')


// catch-all endpoint
server.use('*', (req, res) => {
    res.status(404).json({
        message: "not found"
    })
})

// start server
server.listen(5000, () => {
    console.log('listening on port 5000')
})