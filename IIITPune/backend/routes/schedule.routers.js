import {getSchedule} from '../controllers/schedule.controllers.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { Router } from 'express'

const router = Router()

router.route( "/getschedule" ).get( verifyJWT, getSchedule )


export default router