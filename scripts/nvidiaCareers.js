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

async function getNvidiaJobsAPI() {
    try {
        const url = "https://nvidia.wd5.myworkdayjobs.com/wday/cxs/nvidia/NVIDIAExternalCareerSite/jobs";
        const payload = {
            appliedFacets: {},
            limit: 20,
            offset: 0,
            searchText: "internship"
        };
        const response = await axios.post(url, { params: payload });
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.jobPostings)) {
            jsonData.jobPostings.forEach( job => {
                const location = job.locationsText;

                //https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/details/MBA-2024-Internships--Product-Management--Marketing--Finance-and-Operations_JR1974403
                // api sends : /job/US-CA-Santa-Clara/NVIDIA-Summer-2024-Internships--Computer-Architecture-Intern_JR1978478-1

                let url = job.externalPath;
                url = url.replace('/job/', '');
                const jobUrl = "https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/details/" + url;
                const date = job.postedOn; 
                const agoTime = job.postedOn; 
                const position = job.title;
                const company = "Nvidia";
                const internship = job.title.toLowerCase().includes('intern');
                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime, internship });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Nvidia internship details: ' + error);
    }
}

module.exports = getNvidiaJobsAPI;
