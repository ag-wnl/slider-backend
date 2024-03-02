const axios = require('axios');

// Make sure : Link back job apply link to remotive and mention remotive as source of posting for legal compliance
// Docs : https://github.com/remotive-com/remote-jobs-api
async function getRemotiveJobs() {
    try {
        const url = "https://remotive.com/api/remote-jobs?category=software-dev&search=intern";
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.jobs)) {
            jsonData.jobs.forEach( job => {
                const location = "Remotive";
                const jobUrl = job.url;    
                const date = job.publication_date;
                const agoTime = "";
                const position = job.title;
                const company = job.company_name;

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error fetching postings from Remotive : ' + error);
    }
}

module.exports = getRemotiveJobs;
