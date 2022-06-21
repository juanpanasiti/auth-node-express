const { Router } = require('express');

const router = Router();

router.get('/conn', (req, res) => {
    const now = new Date();

    res.json({
        connection: 'OK',
        time: now,
    });
});

module.exports = router;
