const express = require('express');
const router = express.Router();
const linkedIn = require('linkedin-jobs-api');
const { query } = require('../scripts/linkedinCareers');

router.get("/", async(req, res) => {

    try {
        let selectedjobType = req.query.jobtype;
        let isRemote = req.query.remote;
        let selectedjobField = req.query.jobfield;


        const queryOptions = {
            keyword: 'software ',
            location: 'India',
            dateSincePosted: 'past Week',
            jobType: selectedjobType || 'internship',
            experienceLevel: 'internship',
            remoteFilter: isRemote ? 'remote' : 'site, remote, hybrid',
            limit: '60'
        };


        // const response = await query(queryOptions);
        res.status(200).send([]);

    } catch (err) {
        console.log('Error in fetching from linkedin : ', err);
        res.status(500).json({"error" : "Internal Server Error"})
    }
});

module.exports = router;