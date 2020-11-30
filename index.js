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

        if (users.push(newUser)) {
            return newUser
        }
        return null
    },
    getAll() {
        return users
    },
    getById(id) {
        const user = users.find(user => user.id === id)
        return user
    },
    update(id, changes) {
        const user = users.find(u => u.id === id)
        if(!user) {
            return null
        }
        else {
            users = users.map(user => user.id === id ? {id:user.id, ...changes} : user)
            return users.find(u => u.id === id)
        }
    },
    delete(id) {
        const deletedUser = users.find(u => u.id === id)

        if (deletedUser) {
            users = users.filter(user => user.id !== id)
        }
        return deletedUser
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

    newUser ? res.status(201).json(newUser) : res.status(500).json({errorMessage:"There was an error while saving the user to the database"})
})
server.get('/api/users', (req, res) => {
    const users = User.getAll()

    users ? res.status(200).json(users) : res.status(500).json({errorMessage: "The users information could not be retrieved"})
})
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = User.getById(id)

    user ? res.status(200).json(user) : res.status(404).json({errorMessage: 'The user with the specified ID does not exist.'})
})
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    let deletedUser = null
    if (users.some(user => user.id === id)) {
        deletedUser = User.delete(id)
    }
    else {
        res.status(404).json({message: "The user with the specified ID does not exist."})
        return
    }

    deletedUser ? res.status(200).json(deletedUser) : res.status(500).json({errorMessage: "The user could not be removed"})
})
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const changes = req.body
    let updatedUser = null

    if (!changes.name || !changes.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user"})
        return
    }

    if (users.some(user => user.id === id)) {
        // if id exists then this happens
        updatedUser = User.update(id, changes)
    }
    else {
        res.status(404).json({message: "The user with the specified ID does not exist."})
        return
    }

    updatedUser ? res.status(200).json(updatedUser) : res.status(500).json({ errorMessage:"The user information could not be modified."})
})


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