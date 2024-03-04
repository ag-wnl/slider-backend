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

// object.globalSearchEventV3.jobTitles.data.titles
async function getSnowflakeJobsAPI() {
    try {
        const url = 'https://careers.snowflake.com/widgets';
        const payload = {
            lang: "en_us",
            deviceType: "desktop",
            country: "us",
            pageName: "search-results",
            ddoKey: "globalSearchEventV3",
            keywords: "intern",
            category: "category",
            location: "location"
        };

        const response = await axios.post(url, payload);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.globalSearchEventV3.jobTitles.data.titles)) {
            jsonData.globalSearchEventV3.jobTitles.data.titles.forEach( job => {
                
                const location = job.location;
                const jobUrl = `https://careers.snowflake.com/us/en/job/${job.jobId}/`;    
                const date = "";
                const agoTime = "";
                const position = job.title;
                const company = "Snowflake";
                const internship = job.title.toLowerCase().includes('intern');
                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime, internship });

            
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping snowflake internship details: ' + error);
    }
}

module.exports = getSnowflakeJobsAPI;
