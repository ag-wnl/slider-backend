const axios = require('axios');

//docs : https://github.com/HackerNews/API

function getBatch(string) {
    const regex = /YC\s\w+/;
    const match = string.match(regex);
    if (match) {
        return match[0].replace("YC", "");
    } else {
        return "";
    }
}

function removeBatchFromTitle(string) {
    return string.replace(/YC\s\w+/, "").replace("()", "");
}

async function getYCJobs() {
    try {
        const postIDurl = "https://hacker-news.firebaseio.com/v0/jobstories.json";
        const response = await axios.get(postIDurl);
        
        const postIds = response.data;
        const jobRawData  = await Promise.all(postIds.map(async(id) => {
            const curUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
            const curData = await axios.get(curUrl);
            return curData.data;
        }));

        const jobPostingsData = jobRawData.map( job => {
            const location = getBatch(job.title);
            const jobUrl = job.url ? job.url : `https://news.ycombinator.com/item?id=${job.id}`;    
            const date = "";
            const agoTime = "";
            const position = removeBatchFromTitle(job.title);
            const company = job.company_name ? job.company_name : "YC Backed, " + getBatch(job.title);
            const internship = position.toLowerCase().includes('intern');

            return { position, company, location, jobUrl, date, agoTime, internship };
        })
        
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error fetching postings from YC Hacker : ' + error);
    }
}

module.exports = getYCJobs;
