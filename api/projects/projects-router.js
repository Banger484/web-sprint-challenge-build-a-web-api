// Write your "projects" router here!
const express = require('express')
const router = express.Router()
const P = require('./projects-model')
const { 
    logger,
    validateProjectId,
    validateProject,
} = require('./projects-middleware')

router.get('/', logger, (req, res, next) => {
    P.get()
        .then(projects => {
            res.json(projects)
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/:id', logger, validateProjectId, (req, res, next) => {
    res.status(200).json(req.project)
})

router.post('/', logger, validateProject, async (req, res, next) => {
    const newProject = await P.insert(req.body)
    res.json(newProject)
    
})

router.put('/:id', logger, validateProjectId, async (req, res, next) => {
    const { name, description, completed} = req.body
    await P.update(req.params.id, req.body)
        .then(updatedProject => {
            if(!name || !description || !completed) {
                res.status(400).json(updatedProject)
            } else {
                res.status(200).json(updatedProject)
            }
        })
        .catch(next)
})



router.use((err, req, res, next) => {
    res.status(err.status || 400).json({
      message: err.message,
    });
  });

module.exports = router