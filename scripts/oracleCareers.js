const axios = require('axios');
const cheerio = require('cheerio');

// object.items[0].requisitionList -> this is the array containing all the job objects

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

async function getOracleJobsAPI() {
    try {
        const url = "https://eeho.fa.us2.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.secondaryLocations,flexFieldsFacet.values&finder=findReqs;siteNumber=CX_45001,facetsList=LOCATIONS%3BWORK_LOCATIONS%3BWORKPLACE_TYPES%3BTITLES%3BCATEGORIES%3BORGANIZATIONS%3BPOSTING_DATES%3BFLEX_FIELDS,limit=15,keyword=%22internship%22,sortBy=RECENT";
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.items[0].requisitionList)) {
            jsonData.items[0].requisitionList.forEach( job => {
                const location = job.PrimaryLocation;

                // microsoft job links look like : https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions/preview/:Id
                const jobUrl = `https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions/preview/${job.Id}/`;    
                const date = job.PostedDate;
                const agoTime = calculateDaysAgo(job.PostedDate) + " days";
                const position = job.Title;
                const company = "Oracle";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Orcale internship details: ' + error);
    }
}

module.exports = getOracleJobsAPI;
