import {Router} from "express";
import {setRoom} from "../controllers/room.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getRooms} from "../controllers/get.controllers.js";
import {updateRooms} from "../controllers/update.controllers.js";
import {deleteRooms} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setroom" ).put( verifyJWT, setRoom )
router.route( "/getrooms" ).get( verifyJWT, getRooms )
router.route( "/updateroom" ).post( verifyJWT, updateRooms )
router.route( "/deleteroom" ).post( verifyJWT, deleteRooms )

export default router