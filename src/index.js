const express = require('express')
const { uuid, isUuid } = require('uuidv4')
const app = express()

app.use(express.json())


const projects = []

function logRequests(request, response, next) {
    
    const { method, url } = request
    
    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.log(logLabel)

    //1
    next()
    //3
}

function validadeProjectId(req, res, next) {
    
    const { id } = req.params

    if(!isUuid(id)) {
        return res.status(400).json({error: 'Invalid project ID'}) // stop route
    }

    return next() //go route
}

//app.use(logRequests)

app.use('/projects/:id', validadeProjectId )

app.get('/projects', logRequests, (req, res) => { 
    //2
    const {title} = req.query
    
    const results = title ? projects.filter(project => project.title.includes(title)) : projects
    
    return res.json(projects)
})

app.post('/projects', (req, res) => {
    
    const {title, owner} = req.body
   
    const project = { id: uuid(), title, owner}
    
    projects.push(project)
    
    return res.json(project)
})


app.put('/projects/:id',  (req, res) => {
    
    const { id } = req.params
    
    const {title, owner} = req.body
    
    const projectIndex = projects.findIndex(project => project.id === id)
    
    if (projectIndex < 0) {
        return res.status(400).json({error: 'Project not found!'})
    }
    
    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project

    return res.json(project)
})

app.delete('/projects/:id',  (req, res) => {
    const { id } = req.params
    
    const projectIndex = projects.findIndex(project => project.id === id)
    
    if (projectIndex < 0) {
        return res.status(400).json({error: 'Project not found!'})
    }

    projects.splice(projectIndex, 1)

    return res.status(204).send()
})




const Port = 3333

app.listen(Port, () => {
    console.log(`Server is Running on Port : ${Port}`)
})