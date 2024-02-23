import Express from "express";
import {getPosts} from "../controllers/post.js"
import {addPost,deletePost} from "../controllers/post.js"
const router = Express.Router();

router.get("/",getPosts)
router.post("/",addPost)
router.delete("/:id", deletePost);

export default router;