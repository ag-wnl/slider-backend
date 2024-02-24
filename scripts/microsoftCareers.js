const axios = require('axios');
const cheerio = require('cheerio');

// object.operationResult.result.jobs -> this is the array containing all the job objects

function calculateDaysAgo(dateTimeString) {
    // Parse the given date-time string into a Date object
    const givenDate = new Date(dateTimeString);
    
    // Get the current date and time
    const currentDate = new Date();
    
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - givenDate;
    
    // Convert milliseconds to days
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysAgo;
}

async function getMicrosoftJobsAPI() {
    try {
        const url = "https://gcsservices.careers.microsoft.com/search/api/v1/search?q=intern&lc=India";
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.operationResult.result.jobs)) {
            jsonData.operationResult.result.jobs.forEach( job => {
                const location = job.properties.primaryLocation;

                // microsoft job links look like : https://jobs.careers.microsoft.com/global/en/job/1692981/
                const jobUrl = `https://jobs.careers.microsoft.com/global/en/job/${job.jobId}/`;    
                const date = job.postingDate;
                const agoTime = calculateDaysAgo(job.postingDate) + " days";
                const position = job.title;
                const company = "Microsoft";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Microsoft internship details: ' + error);
    }
}

module.exports = getMicrosoftJobsAPI;
