const express = require('express');
const router = express.Router();
const scrapeGoogleInternshipDetails = require('../scripts/googleCareers');
const getAmazonJobs = require('../scripts/amazonCareers')
const getMicrosoftJobs = require('../scripts/microsoftCareers')
const getNetflixJobs = require('../scripts/netflixCareers')
const getOracleJobs = require('../scripts/oracleCareers')
const getAtlassianJobs = require('../scripts/atlassianCareers')
const getNvidiaJobs = require('../scripts/nvidiaCareers')
const getSnowflakeJobs = require('../scripts/snowflakeCareers')
const getDatabricksJobs = require('../scripts/databricksCareers')
const getMetaJobs = require('../scripts/metaCareers')
const getIBMJobs = require('../scripts/ibmCareers')

const fs = require('fs');
const path = require('path');
const cacheFilePath = path.join(__dirname, '../storage/bigtechCache.json');

function randomizeArray(arr) {
    for(let i = arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[i], arr[j]];
    }
}

async function fetchInternshipDetails() {

    const jobPromises = [
        getAmazonJobs().catch(error => []),
        getMicrosoftJobs().catch(error => []),
        getNetflixJobs().catch(error => []),
        getOracleJobs().catch(error => []),
        getAtlassianJobs().catch(error => []),
        getNvidiaJobs().catch(error => []),
        getSnowflakeJobs().catch(error => []),
        getDatabricksJobs().catch(error => []),
        getIBMJobs().catch(error => [])
    ];

    try {
        const [amazonJobPostings, microsoftPostings, netflixPostings, oraclePostings, 
            atlassianPostings, nvidiaPostings, snowflakePostings, 
            databricksPostings, ibmPostings] = await Promise.all(jobPromises);

        const allJobPostings = amazonJobPostings.concat(microsoftPostings, netflixPostings, 
            oraclePostings, atlassianPostings, nvidiaPostings, snowflakePostings, 
            databricksPostings, ibmPostings);
        // allJobPostings = randomizeArray(allJobPostings);

        return allJobPostings;
    } catch (error) {
        throw new Error('Error fetching internship details: ' + error);
    }
}


// Implemented caching of big-tech job data and we check if last saved version was less than hour ago.
// If yes then simply return it, if no then refetch it. Cold start response time only for a single user
// request that too once every hour, everything else works fine g

router.get("/", async(req, res) => {

    fs.readFile(cacheFilePath, (err, data) => {
        if(err) {
            console.log(err);
            return;
        } 

        try {
            const { timestamp, jobPostings } = JSON.parse(data);
            const currentTime = Date.now();
            const isDataValid = timestamp && (currentTime - timestamp < 3600000); // 1 hour in milliseconds

            if(isDataValid) {
                res.status(200).send(jobPostings);
                return;
            } 
            else {
                fetchInternshipDetails()
                .then(allJobPostings => {

                    const timestamp = Date.now();
                    const cachedData = {timestamp, jobPostings : allJobPostings}

                    fs.writeFile(cacheFilePath, JSON.stringify(cachedData), (err) => {
                        if(err) {
                            console.log("Error in caching json response: ", err);
                        } 
                    })

                    res.status(200).send(allJobPostings);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        } catch (error) {
            console.log("Error occured : ", error);
        }
    })
});

module.exports = router;