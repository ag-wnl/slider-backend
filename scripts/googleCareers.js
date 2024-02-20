// target ul element class = 'spHGqe'
// all li elements represent a single job
// h3 element with class = 'QJPWVe' is the position title
// span of class = 'r0wTof' is the location of the position
// a tag of class = 'WpHeLc VfPpkd-mRLv6 VfPpkd-RLmnJb' is the link to view/apply the job
// href needs to have a added prefix of https://careers.google.com/

// class naming convention same for all list elements

// scraper.js

const axios = require('axios');
const cheerio = require('cheerio');

const puppeteer = require('puppeteer');

async function scrapeGoogleInternshipDetails(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the ul element containing all job postings to load
        await page.waitForSelector('ul.spHGqe');

        // Get the HTML content of the page
        const htmlContent = await page.content();
        const $ = cheerio.load(htmlContent);

        const jobPostings = [];

        // Select the ul element containing all job postings
        const jobList = $('ul.spHGqe');

        // Iterate over each li element (job posting) within the ul
        jobList.find('li').each((index, element) => {
            const position = $(element).find('h3.QJPWVe').text().trim();
            const company = 'Google';
            const location = $(element).find('span.r0wTof').first().text().trim();
            const jobUrl = 'https://careers.google.com/' + $(element).find('.WpHeLc.VfPpkd-mRLv6.VfPpkd-RLmnJb').attr('href');
            const date = '';
            const agoTime = '';
            // Add job posting details to the array
            if (position) {
                jobPostings.push({ position, company, location, jobUrl, date, agoTime });
            }
        });

        await browser.close();

        return jobPostings;
    } catch (error) {
        throw new Error('Error scraping Google internship details: ' + error);
    }
}

module.exports = scrapeGoogleInternshipDetails;
