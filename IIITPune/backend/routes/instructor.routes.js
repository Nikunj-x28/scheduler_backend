import {Router} from "express";
import {setinstructor} from "../controllers/instructor.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {getInstructors} from "../controllers/get.controllers.js";
import {updateInstructors} from "../controllers/update.controllers.js";
import {deleteInstructors} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setinstructor" ).put( verifyJWT, setinstructor )
router.route( "/getinstructors" ).get( verifyJWT, getInstructors )
router.route( "/updateinstructor" ).post( verifyJWT, updateInstructors )
router.route( "/deleteinstructor" ).post( verifyJWT, deleteInstructors )

export default router