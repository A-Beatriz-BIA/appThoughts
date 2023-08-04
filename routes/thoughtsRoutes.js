const express = require('express')
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

const checkAuth = require('../helpers/auth').checkAuth //importação de modulo de middeware

router.get('/dashboard', ThoughtController.dashboard)