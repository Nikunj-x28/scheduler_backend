import {Router} from "express";
import {setTime} from "../controllers/meeting.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getMeetings} from "../controllers/get.controllers.js";
import {updateMeetings} from "../controllers/update.controllers.js";
import {deleteMeetings} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setmeeting" ).put( verifyJWT, setTime )
router.route( "/getmeetings" ).get( verifyJWT, getMeetings )
router.route( "/updatemeeting" ).post( verifyJWT, updateMeetings )
router.route( "/deletemeeting" ).post( verifyJWT, deleteMeetings )

export default router