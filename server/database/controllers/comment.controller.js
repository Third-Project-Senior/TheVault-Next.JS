const {Comment} = require('../index.js');

module.exports = {
    createComment: async (req, res) => {
        const { content, userId, productId } = req.body;
        try {
            const newComment = await Comment.create({ content, userId, productId });
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Comment creation error:', error);
            res.status(500).json({ 
                error: 'Failed to create comment', 
                details: error.message,
                name: error.name
            });
        }
    },

    getCommentsByProductId: async (req, res) => {
        const { productId } = req.params;
        try {
            const comments = await Comment.findAll({ where: { productId } });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch comments' });
        }
    },

    updateComment: async (req, res) => {
        const { id } = req.params;
        const { content } = req.body;
        try {
            const [updated] = await Comment.update({ content }, { where: { id } });
            if (updated) {
                const updatedComment = await Comment.findOne({ where: { id } });
                res.status(200).json(updatedComment);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update comment' });
        }
    },

    deleteComment: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await Comment.destroy({ where: { id } });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete comment' });
        }
    },
}