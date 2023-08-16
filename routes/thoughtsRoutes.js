const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth //importação de modulo de middeware

router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtSave)
router.post('/remove', checkAuth, ThoughtController.removeThought)
router.get('/edit: id', checkAuth, ThoughtController.updateThought)
router.post('/edit', checkAuth, ThoughtController.updateThoughtPost)
router.get('/dashboard', ThoughtController.dashboard)
router.get('/', ThoughtController.showThougths)

module.exports = router