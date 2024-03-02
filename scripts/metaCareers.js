//https://www.metacareers.com/graphql

const axios = require('axios');
// TODO : fix causing bad request


async function getMetaJobsAPI() {
    try {
        const url = "https://www.metacareers.com/graphql";
        
        const payload = {
            av: 0,
            __user: 0,
            __a: 1,
            __req: 5,
            __hs: "19782.BP:DEFAULT.2.0..0.0",
            dpr: 1,
            __ccg: "GOOD",
            __rev: 1011739905,
            __s: "62k0r3:zzakvq:sg64se",
            __hsi: 7340995971198509316,
            __dyn: "7xeUmwkHg7ebwKBAg5S1Dxu13wqovzEdEc8uxa1twKzobo1nEhwem0nCq1ewcG0KEswaq1xwEw7Bx61vw4iwBgao881FU2Ixe0DopyE3bwkE5G0zE5W0HUvw4Jwp8oxa0YU2ZwrU6C0P82Sw8i6E3ewt8",
            __csr: "",
            lsd: "AVrqnwAowt4",
            jazoest: 21070,
            __spin_r: 1011739905,
            __spin_b: "trunk",
            __spin_t: 1709208817,
            __jssesw: 1,
            fb_api_caller_class: "RelayModern",
            fb_api_req_friendly_name: "CareersJobSearchLocationFilterQuery",
            variables: "{}",
            server_timestamps: true,
            doc_id: 5694898813948803
        };

        const response = await axios.post(url, { params: payload });
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.data.job_search)) {
            jsonData.data.job_search.forEach( job => {
                const location = job.locations[0];
                const jobUrl = `https://www.metacareers.com/jobs/${job.id}/`;
                const date = ""; 
                const agoTime = ""; 
                const position = job.title;
                const company = "Meta";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Meta internship details: ' + error);
    }
}

module.exports = getMetaJobsAPI;
