const express = require('express');
const router = express.Router();

router.get("/", async(req, res) => {    
    res.status(200).json({"Endpoint Status" : "active"}); // An array of Job objects
});

module.exports = router;