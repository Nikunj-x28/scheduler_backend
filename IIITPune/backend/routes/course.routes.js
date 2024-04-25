import {Router} from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {setCourse} from "../controllers/course.controllers.js";
import {getCourses} from "../controllers/get.controllers.js";
import {updateCourses} from "../controllers/update.controllers.js";
import {deleteCourses} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setcourse" ).put( verifyJWT, setCourse )
router.route( "/getcourses" ).get( verifyJWT, getCourses )
router.route( "/updatecourse" ).post( verifyJWT, updateCourses )
router.route( "/deletecourse" ).post( verifyJWT, deleteCourses )

export default router