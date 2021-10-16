const router = require('express').Router();
const { findCards, postCard, deleteCard, putLike, deleteLike } = require('../contollers/cards');

router.get('/cards', findCards);

router.post('/cards', postCard);

router.delete('/cards/:cardId', deleteCard);
router.delete('/cards/:cardId/likes', deleteLike);

router.put('/cards/:cardId/likes', putLike);

module.exports = router;
