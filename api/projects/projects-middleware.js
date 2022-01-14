// add middlewares here related to projects

const P = require('./projects-model')

function logger(req, res, next) {
    const method = req.method
    const url = req.baseUrl
    const status = res.statusCode

    const log = `${method} - ${url} - ${status}`

    console.log(log)
    next()
}

async function validateProjectId(req, res, next) {
    try{
        const project = await P.get(req.params.id)
        if(!project) {
            res.status(404).json({
                message: "Project with that id cannot be found."
            })
            next()
        } else {
            req.project = project
            next()
        }
    }
    catch (err) {
        next(err)
    }
}
function validateProject(req, res, next) {
    const { name, description } = req.body
    if(!name || !description) {
        res.status(400).json({
            message: "Name and Description fields are required."
        })
    } else {
        req.name = name
        req.description = description
        next()
    }
}


module.exports = {
    logger,
    validateProjectId,
    validateProject,
}