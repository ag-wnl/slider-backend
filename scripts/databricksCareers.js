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

// object.result.pageContext.data.allGreenhouseDepartment.nodes[70].jobs : array of jobs

async function getDatabricksJobsAPI() {
    try {
        const url = "https://www.databricks.com/careers-assets/page-data/company/careers/open-positions/page-data.json?department=University%20Recruiting&location=all";
        
        const response = await axios.get(url);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        const nodesArray = jsonData.result.pageContext.data.allGreenhouseDepartment.nodes;
        const index = nodesArray.findIndex(node => node.name === "University Recruiting");

        if(jsonData && Array.isArray(jsonData.result.pageContext.data.allGreenhouseDepartment.nodes[index].jobs)) {
            jsonData.result.pageContext.data.allGreenhouseDepartment.nodes[index].jobs.forEach( job => {
                
                const location = job.offices[0].name;

                //https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/details/MBA-2024-Internships--Product-Management--Marketing--Finance-and-Operations_JR1974403
                // api sends : /job/US-CA-Santa-Clara/NVIDIA-Summer-2024-Internships--Computer-Architecture-Intern_JR1978478-1

                const jobUrl = job.absolute_url;
                const date = job.updated_at; 
                const agoTime = calculateDaysAgo(job.updated_at) + " days"; 
                const position = job.title;
                const company = "Databricks";
                const internship = job.title.toLowerCase().includes('intern');
                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime, internship });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Databricks internship details: ' + error);
    }
}

module.exports = getDatabricksJobsAPI;
