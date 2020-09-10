const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment, Campground } = require('../models');
const withAuth = require('../utils/auth');

// see personal reviews created
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'post_body',
            'created_at'
        ],
        include: [
            { 
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(data => {
        const posts = data.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
// get single post to edit
>>>>>>> 8c694634cbbf920790de5b91eb8ee6db345cd0e6
=======
// get single post to edit
=======
>>>>>>> b3a04bf516edbda287f78c69d327545f40ac97a4
>>>>>>> d6ddc65c1b8d12549e5ed58fcf991c07ebdca5bb
=======
// get single post to edit
>>>>>>> 98d04a9bc799d625cdffd6c47909b2c6d03952c9
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'title',
            'post_body',
            'created_at',
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(data => {
            const post = data.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;