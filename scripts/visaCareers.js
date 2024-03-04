const axios = require('axios');

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

// object.jobPostings : array of jobs

async function getVisaJobsAPI() {
    try {
        const url = "https://search.visa.com/CAREERS/careers/jobs?q=internship";
        const payload = {"filters":[{"department":["Intern","Software Development/Engineering"]}],"from":0,"size":10,"sort":{"createdOn":"DESC"}};
        const response = await axios.post(url, { params: payload });
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.jobDetails)) {
            jsonData.jobDetails.forEach( job => {
                const location = `${job.city}, ${job.region}, ${job.countryCode}`;
                const jobUrl = job.applyUrl;
                const date = job.createdOn; 
                const agoTime = ""; 
                const position = job.jobTitle;
                const company = "Visa";
                const internship = job.jobTitle.toLowerCase().includes('intern');

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime, internship });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Nvidia internship details: ' + error);
    }
}

module.exports = getVisaJobsAPI;
