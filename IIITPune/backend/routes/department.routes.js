import {Router} from "express";
import {setdepartment} from "../controllers/department.controllers.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {deleteDepartments} from "../controllers/delete.contollers.js";
import {getDepartments} from "../controllers/get.controllers.js";

const router = Router()

router.route( "/setdepartment" ).put( verifyJWT, setdepartment )
router.route( "/getdepartments" ).get( verifyJWT, getDepartments )
router.route( "/deletedepartment" ).post( verifyJWT, deleteDepartments )

export default router