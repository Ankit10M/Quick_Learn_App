import express from 'express'
import {authMiddleware} from '../middleware/auth.js'
import { createResult, listResults } from '../controllers/resultController.js'
const resultRoute = express.Router()

resultRoute.post('/',authMiddleware,createResult)
resultRoute.get('/',authMiddleware,listResults)
export default resultRoute;