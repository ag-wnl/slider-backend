const axios = require('axios');

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

async function getAtlassianJobsAPI() {
    try {
        const url = "https://www.atlassian.com/endpoint/careers/listings";
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData)) {
            jsonData.forEach( job => {
                if(job.title.toLowerCase().includes('intern')) {

                    const location = job.locations[0];
                    const jobUrl = `https://www.atlassian.com/company/careers/details/${job.id}/`;    
                    const date = "";
                    const agoTime = "";
                    const position = job.title;
                    const company = "Atlassian";

                    jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });

                }
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Atlassian internship details: ' + error);
    }
}

module.exports = getAtlassianJobsAPI;
