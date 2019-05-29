const Blogs = require('../data/db.js');

const router = require('express').Router();

/*******************************************/
/*****          Insert a new post          */
/***************************************** */
router.post('/', async (req, res) => {
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
    else {
        try {
            const blog = await Blogs.insert(req.body);
            res.status(201).send(blog);
        } catch (error) {
            res.status(500).send({error: "There was an error while saving the post to the database"});
        }
    }
    
});

/*****************************************************************/
/*****          Create a comment for a specific post             */
/*****************************************************************/

router.post('/:id/comments', async (req, res) => {

    const postId = await Blogs.findById(req.params.id);

    if (!postId) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
        return;
    }
    if (!req.body.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })    
        return;        
    }
    try {
        const comment =  {text: req.body.text, post_id: req.params.id};         //info sent in the request
        const commentId = await Blogs.insertComment(comment);                   //insertComments returns comment id object {id: xx}
        const newComment = await Blogs.findCommentById(commentId.id)            //Find back inserted comment from database
        res.status(201).json(newComment);                                       //Send back inserted comment
        
    } catch (error) {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    }
})


/********************************************/
/*****          Get a post by Id            */
/*****************************************  */

router.get('/:id', async (req, res) => {
    

        try {
            const postById = await Blogs.findById(req.params.id);
            if (!postById) { 
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
            else {
                res.status(200).json(postById)
            }
        } catch(error) {
            res.status(500).json({ error: "The post information could not be retrieved." });
            }
        }  
    
)

/********************************************/
/*****          Get all posts               */
/*****************************************  */
router.get('/', async (req, res) => {
    try {
        const blogs = await Blogs.find()
        res.status(200).json(blogs);
    } catch(error) {
        res.status(500).json({error: "The posts information could not be retrieved."})
    }
})

/******************************************************/
/*****          Get all comments of a post            */
/******************************************************/

router.get('/:id/comments', async (req, res) => {
    const postById = await Blogs.findById(req.params.id);
    if (!postById) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    else {
        try {
            const comments = await Blogs.findPostComments(req.params.id)
            res.status(200).json(comments)
        } catch(error) {
            res.status(500).json({ error: "The comments information could not be retrieved." });
            }
        }
    }
)

/********************************************/
/*****          Delete a post               */
/********************************************/
router.delete('/:id', async (req, res) => {
    const postById = await Blogs.findById(req.params.id);
    if (!postById) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    else {
        try {
            await Blogs.remove(req.params.id)
            res.status(200).json(`Post ${req.params.id} has been deleted`);
        } catch(error) {
            res.status(500).json({ error: "The post could not be removed." });
        }
    }
    
})

/**********************************************************/
/*****          Update a post identified by Id            */
/**********************************************************/

router.put('/:id', async (req, res) => {
    const postById = await Blogs.findById(req.params.id);
    if (!postById) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    if (!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and content for the post." })            
    }
    
    else {
        try {
            await Blogs.update(req.params.id, req.body);
            updatedPost = await Blogs.findById(req.params.id);
            res.status(200).json(updatedPost)
        } catch(error) {
            res.status(500).json({ error: "The post information could not be retrieved." });
            }
        }
    }
)





module.exports = router;