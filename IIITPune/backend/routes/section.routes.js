import {Router} from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {setSection} from "../controllers/section.controllers.js";
import {getSections} from "../controllers/get.controllers.js";
import {updateSections} from "../controllers/update.controllers.js";
import {deleteSections} from "../controllers/delete.contollers.js";

const router = Router()

router.route( "/setsection" ).put( verifyJWT, setSection )
router.route( "/getsections" ).get( verifyJWT, getSections )
router.route( "/updatesection" ).post( verifyJWT, updateSections )
router.route( "/deletesection" ).post( verifyJWT, deleteSections )

export default router