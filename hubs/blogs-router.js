const Blogs = require('../data/db.js');

const router = require('express').Router();

/*******************************************/
/*****          Insert a new post          */
/***************************************** */
router.post('/', async (req, res) => {
    console.log(req.body);
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }

    else {
        try {
            const blog = await Blogs.insert(req.body);
            res.status(201).send(blog);
        } catch (error) {
            console.log(error);
            res.status(500).send({error: "There was an error while saving the post to the database"});
        }
    }
    
});

/*****************************************************************/
/*****          Create a comment for a specific post             */
/*****************************************************************/

router.post('/:id/comments', (req, res) => {

    const postId = await Blogs.findById(req.params.id);
    if (!postId) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    if (!req.body.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })            
    }
    try {
        comment =  {text: req.body.text, post_id: req.params.id};
        Blogs.insertComment(comment);
        res.
        

        
    } catch (error) {

    }
})


/********************************************/
/*****          Get a post by Id            */
/*****************************************  */

router.get('/:id', async (req, res) => {
    const postById = await Blogs.findById(req.params.id);
    if (!postById) { 
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
    else {
        try {
            res.status(200).json(postById)
        } catch(error) {
            console.log(error); 
            res.status(500).json({ error: "The post information could not be retrieved." });
            }
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
        console.log(error);
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
            console.log(comments);
            res.status(200).json(comments)
        } catch(error) {
            console.log(error); 
            res.status(500).json({ error: "The comments information could not be retrieved." });
            }
        }
    }
)






module.exports = router;