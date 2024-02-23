import Express from "express";
import {getComments} from "../controllers/comment.js"
import {addCommments} from "../controllers/comment.js"

const router = Express.Router();

router.get("/",getComments)
router.post("/",addCommments)

export default router;