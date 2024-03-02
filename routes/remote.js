const express = require('express');
const router = express.Router();

const getRemotiveJobs = require('../remoteScripts/remotive')
const getYCJobs = require('../remoteScripts/YC')

const fs = require('fs');
const path = require('path');
const cacheFilePath = path.join(__dirname, '../storage/remoteJobsCache.json');

function randomizeArray(arr) {
    for(let i = arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[i], arr[j]];
    }
}

async function fetchRemoteJobsDetails() {

    const jobPromises = [
        getYCJobs().catch(error => []),
        getRemotiveJobs().catch(error => [])
    ]
    try {
        const [YCjobs, remotiveJobs] = await Promise.all(jobPromises);

        const allJobPostings = YCjobs.concat(remotiveJobs);
        // allJobPostings = randomizeArray(allJobPostings);

        return allJobPostings;
    } catch (error) {
        throw new Error('Error fetching remote job details: ' + error);
    }
}

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
                fetchRemoteJobsDetails()
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