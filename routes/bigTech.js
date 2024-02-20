const express = require('express');
const router = express.Router();
const scrapeGoogleInternshipDetails = require('../scripts/googleCareers');
const scrapeAmazonInternshipDetails = require('../scripts/amazonCareers');

const fs = require('fs');
const cacheFilePath = '../backend/storage/bigtechCache.json';


// https://www.google.com/about/careers/applications/jobs/results?location=India&q=intern
// https://www.amazon.jobs/en/search?&sort=recent&base_query=intern&country=IND
// https://jobs.careers.microsoft.com/global/en/search?q=intern&lc=India&o=Recent

const googleCareersURL = 'https://www.google.com/about/careers/applications/jobs/results?q=intern&sort_by=date';
const amazonCareersURL = 'https://www.amazon.jobs/en/search?&sort=recent&base_query=intern&country=IND';
//https://www.google.com/about/careers/applications/jobs/results?sort_by=date&employment_type=INTERN

function randomizeArray(arr) {
    for(let i = arr.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[i], arr[j]];
    }
}

async function fetchInternshipDetails() {
    try {
        const [googleJobPostings, amazonJobPostings] = await Promise.all([
            scrapeGoogleInternshipDetails(googleCareersURL),
            scrapeAmazonInternshipDetails(amazonCareersURL)
        ]);

        const allJobPostings = googleJobPostings.concat(amazonJobPostings);
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