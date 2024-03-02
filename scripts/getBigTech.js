// Under work, not complete or working

// common schema for job postings
const commonSchema = {
    position: 'title',
    company: 'companyName',
    location: 'location',
    jobUrl: 'jobUrl',
    date: 'date',
    agoTime: 'agoTime',
};

// Generic parser function to parse response data
function parseJobs(data, mapping) {
    const jobPostingsData = [];
    data.forEach(job => {
        const jobDetails = {};
        for (const [commonField, sourceField] of Object.entries(mapping)) {
            jobDetails[commonField] = job[sourceField];
        }
        jobPostingsData.push(jobDetails);
    });
    return jobPostingsData;
}

// Specific parsers for different sources
function parseDatabricksJobs(data) {
    // Mapping for Databricks jobs
    const databricksMapping = {
        title: 'title',
        companyName: 'companyName',
        location: 'location',
        jobUrl: 'absolute_url',
        date: 'updated_at',
        agoTime: calculateDaysAgo('updated_at'),
    };
    return parseJobs(data, databricksMapping);
}

function parseAtlassianJobs(data) {
    // Mapping for Atlassian jobs
    const atlassianMapping = {
        title: 'title',
        companyName: 'companyName',
        location: 'locations[0]',
        jobUrl: 'id',
        date: '', // You need to define how to extract the date
        agoTime: '', // You need to define how to calculate agoTime
    };
    return parseJobs(data, atlassianMapping);
}

module.exports = {
    parseDatabricksJobs,
    parseAtlassianJobs,
    // Add more parsers for other sources if needed
};
