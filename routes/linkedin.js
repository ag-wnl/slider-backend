const express = require('express');
const router = express.Router();
const linkedIn = require('linkedin-jobs-api');
const scrapeGoogleInternshipDetails = require('../scripts/googleCareers');
const scrapeAmazonInternshipDetails = require('../scripts/amazonCareers');

router.get("/", async(req, res) => {

    let selectedjobType = req.query.jobtype;
    let isRemote = req.query.remote;
    let selectedjobField = req.query.jobfield;


    const queryOptions = {
        keyword: selectedjobField || 'software engineering',
        location: 'India',
        dateSincePosted: 'past Week',
        jobType: selectedjobType || 'internship',
        experienceLevel: 'internship',
        remoteFilter: isRemote ? 'remote' : 'site, remote, hybrid',
        limit: '80'
    };


    linkedIn.query(queryOptions).then(response => {
        res.status(200).send(response); // An array of Job objects
    });

    // res.json({"listings" : ["google", "meta", "netflix", "spotify", "amazon"]})
});

module.exports = router;