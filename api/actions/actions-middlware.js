// add middlewares here related to actions

const A = require('./actions-model')

function logger(req, res, next) {
    const method = req.method
    const url = req.baseUrl
    const status = res.statusCode

    const log = `${method} - ${url} - ${status}`

    console.log(log)
    next()
}

async function validateActionId(req, res, next) {
    try{
        const action = await A.get(req.params.id)
        if(!action) {
            res.status(404).json({
                message: "The action with that id cannot be found."
            })
            next()
        } else {
            req.action = action
            next()
        }
    }
    catch (err) {
        next(err)
    }
}

function validateAction(req, res, next) {
    const { notes, description, project_id } = req.body
    if(!notes || !description || !project_id) {
        res.status(400).json({
            message: "Notes, Description, and Project Id fields are required."
        })
    } else {
        req.notes = notes
        req.description = description
        req.project_id = project_id
        next()
    }
}
module.exports = {
    logger,
    validateActionId,
    validateAction,
}