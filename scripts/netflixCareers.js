const axios = require('axios');
const cheerio = require('cheerio');

// object.records.postings -> this is the array containing all the job objects

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

async function getNetflixJobsAPI() {
    try {
        const url = "https://jobs.netflix.com/api/search?q=intern%team=Internship";
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.records.postings)) {
            jsonData.records.postings.forEach( job => {
                const location = job.location;

                // microsoft job links look like : https://jobs.netflix.com/jobs/:external_id
                const jobUrl = `https://jobs.netflix.com/jobs/${job.external_id}/`;    
                const date = job.updated_at;
                const agoTime = calculateDaysAgo(job.updated_at) + " days";
                const position = job.text;
                const company = "Netflix";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Netflix internship details: ' + error);
    }
}

module.exports = getNetflixJobsAPI;
