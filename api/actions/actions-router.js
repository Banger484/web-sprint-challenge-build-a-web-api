// Write your "actions" router here!
const express = require('express')
const router = express.Router()
const A = require('./actions-model')
const {
    logger,
    validateActionId,
    validateAction
} = require('./actions-middlware')

router.get('/', (req, res, next) => {
    A.get()
        .then(actions => {
            res.json(actions)
        })
        .catch(next)
})

router.get('/:id', logger, validateActionId, (req, res, next) => {
    res.status(200).json(req.action)
})

router.post('/', logger, validateAction, async (req, res, next) => {
    const newAction = await A.insert(req.body)
    res.json(newAction)
})

router.put('/:id', logger, validateActionId, async (req, res, next) => {
    const { notes, description, completed, project_id} = req.body
    await A.update(req.params.id, req.body)
        .then(updatedAction => {
            if(!notes || !description || !completed || !project_id) {
                res.status(400).json(updatedAction)
            } else {
                res.status(200).json(updatedAction)
            }
        })
        .catch(next)
})

router.delete('/:id', logger, validateActionId, (req, res, next) => {
    A.remove(req.params.id)
        .then(deletedAction => {
            res.status(200).json(deletedAction)
        })
        .catch(next)
})

router.use((err, req, res, next) => {
    res.status(err.status || 400).json({
      message: err.message,
    });
  });

module.exports = router