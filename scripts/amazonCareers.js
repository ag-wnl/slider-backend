//div class contains job-tile-lists -> is the main parent div of all job tiles
// div class = 'job-tile' is individual job tile
// within it class = 'job-title' contains <a> with href and we need to add https://amazon.jobs/ to its prefix
// class = 'posting-date' is the date posted at 
// class name containing location-and-id in its name has the locations

const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrapeAmazonInternshipDetails(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the main parent div containing job tiles to load
        await page.waitForSelector('.job-tile-lists');

        // Get the HTML content of the page
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);

        const jobPostings = [];

        // Select the main parent div containing all job tiles
        const jobList = $('div[class*=job-tile-lists]');

        // Iterate over each job tile within the main parent div
        jobList.find('.job-tile').each((index, element) => {
            const position = $(element).find('.job-title a').text().trim();
            const company = 'Amazon';
            const jobUrl = 'https://amazon.jobs/' + $(element).find('.job-title a').attr('href');
            const location = $(element).find('[class*=location-and-id]').text().trim();
            const date = $(element).find('.posting-date').text().trim();
            const agoTime = '';

            if (position) {
                jobPostings.push({ position, company, location, jobUrl, date, agoTime });
            }
        });

        await browser.close();

        return jobPostings;
    } catch (error) {
        throw new Error('Error scraping Amazon internship details: ' + error);
    }
}


// object.jobs -> array of jobs : this is the area to fecth
// https://www.amazon.jobs/en/search.json?base_query=intern&city=&country=IND&region=&county=&query_options=&

async function getAmazonJobsAPI() {
    try {
        const AmazonUrl = "https://www.amazon.jobs/en/search.json?base_query=intern&city=&country=IND&region=&county=&query_options=&";
        const response = await axios.get(AmazonUrl);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.jobs)) {
            jsonData.jobs.forEach( job => {
                const location = job.city;
                const jobUrl = `https://amazon.jobs/en/jobs/${job.id_icims}/`;               
                
                // format : https://amazon.jobs/en/jobs/2567484/, what we get from api: https://account.amazon.com/jobs/2567484/apply
                // so just use id_icims and insert it in place of job id

                const date = job.posted_date;
                const agoTime = job.updated_time;
                const position = job.title;
                const company = "Amazon";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping Amazon internship details: ' + error);
    }
}



module.exports = getAmazonJobsAPI;
