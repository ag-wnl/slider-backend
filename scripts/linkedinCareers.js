
const cheerio = require("cheerio");
const axios = require("axios");

const ipv6addresses = [
    '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    '2001:0db8:ff00:0042:0000:8a2e:0370:7334',
    '2001:0db8:cdba:0000:0000:0000:0000:0000',
    '2001:0db8:0000:0000:0000:0000:0000:0001',
    '2001:0db8:1234:0000:0000:0000:0000:0000',
    '2001:0db8:0000:0000:0000:0000:0000:ffff',
    '2001:0db8:0000:0000:0000:0000:0000:0000',
    '2001:0db8:0000:0000:0000:0000:0000:0002',
    '2001:0db8:0000:0000:0000:0000:0000:0003',
    '2001:0db8:0000:0000:0000:0000:0000:0004'
];

const randomIndex = Math.floor(Math.random() * ipv6addresses.length);
const randomIpv6Address = ipv6addresses[randomIndex];

class Query {
  constructor(queryObj) {
    this.host = queryObj.host || "www.linkedin.com";
    this.keyword = queryObj.keyword?.replace(" ", "+") || "";
    this.location = queryObj.location?.replace(" ", "+") || "";
    this.dateSincePosted = queryObj.dateSincePosted || "";
    this.jobType = queryObj.jobType || "";
    this.remoteFilter = queryObj.remoteFilter || "";
    this.salary = queryObj.salary || "";
    this.experienceLevel = queryObj.experienceLevel || "";
    this.sortBy = queryObj.sortBy || "";
    this.limit = Number(queryObj.limit) || 0;
  }

  getDateSincePosted() {
    const dateRange = {
      "past month": "r2592000",
      "past week": "r604800",
      "24hr": "r86400",
    };
    return dateRange[this.dateSincePosted.toLowerCase()] ?? "";
  }

  getExperienceLevel() {
    const experienceRange = {
      internship: "1",
      "entry level": "2",
      associate: "3",
      senior: "4",
      director: "5",
      executive: "6",
    };
    return experienceRange[this.experienceLevel.toLowerCase()] ?? "";
  }

  getJobType() {
    const jobTypeRange = {
      "full time": "F",
      "full-time": "F",
      "part time": "P",
      "part-time": "P",
      contract: "C",
      temporary: "T",
      volunteer: "V",
      internship: "I",
    };
    return jobTypeRange[this.jobType.toLowerCase()] ?? "";
  }

  getRemoteFilter() {
    const remoteFilterRange = {
      "on-site": "1",
      "on site": "1",
      remote: "2",
      hybrid: "3",
    };
    return remoteFilterRange[this.remoteFilter.toLowerCase()] ?? "";
  }

  getSalary() {
    const salaryRange = {
      40000: "1",
      60000: "2",
      80000: "3",
      100000: "4",
      120000: "5",
    };
    return salaryRange[this.salary.toLowerCase()] ?? "";
  }

  url(start) {
    let query = `https://${this.host}/jobs-guest/jobs/api/seeMoreJobPostings/search?`;
    if (this.keyword !== "") query += `keywords=${this.keyword}`;
    if (this.location !== "") query += `&location=${this.location}`;
    if (this.getDateSincePosted() !== "")
      query += `&f_TPR=${this.getDateSincePosted()}`;
    if (this.getSalary() !== "") query += `&f_SB2=${this.getSalary()}`;
    if (this.getExperienceLevel() !== "")
      query += `&f_E=${this.getExperienceLevel()}`;
    if (this.getRemoteFilter() !== "")
      query += `&f_WT=${this.getRemoteFilter()}`;
    if (this.getJobType() !== "") query += `&f_JT=${this.getJobType()}`;
    query += `&start=${start}`;
    if (this.sortBy == "recent" || this.sortBy == "relevant") {
      let sortMethod = "R";
      if (this.sortBy == "recent") sortMethod = "DD";
      query += `&sortBy=${sortMethod}`;
    }
    return encodeURI(query);
  }
}

async function query(queryObject) {
  const query = new Query(queryObject);
  console.log(query.url(0));
  return query.getJobs();
}

Query.prototype.getJobs = async function () {
  try {
    let parsedJobs,
      resultCount = 1,
      start = 0,
      jobLimit = this.limit,
      allJobs = [];

    while (resultCount > 0) {
      const { data } = await axios.get(this.url(start), {
        headers: {
          accept: "*/*",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Max OS X 10_5_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
          "accept-language" : "en-US, en-CA;q=0.9,en-AU;q=0.8,en;q=0.7",
          "content-type": "application/json",
          "sec-ch-ua":
            '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand"; v="24"',
          "sec-ch-ua-mobile" : "?0",
          "sec-ch-ua-platform" : '"macOS"',
          "sec-fetch-dest" : "empty",
          "sec-fetch-mode" : "cors",
          "sec-fetch-site" : "same-origin",
          "X-Forwarded-For" : randomIpv6Address,
          "Referrer-Policy" : "unsafe-url",
        },
        body: null,
        method: "GET",
      });
      
      const jobs = parseJobList(data);
      resultCount = jobs.length;
      console.log("I got ", jobs.length, " jobs");
      parsedJobs = jobs;
      allJobs.push(...parsedJobs);
      start += 25;
      if (jobLimit != 0 && allJobs.length > jobLimit) {
        while (allJobs.length != jobLimit) allJobs.pop();
        return allJobs;
      }
    }
    return allJobs;
  } catch (error) {
    console.error(error);
  }
};

function parseJobList(jobData) {
  const $ = cheerio.load(jobData);
  const jobs = $("li");

  const jobObjects = jobs
    .map((index, element) => {
      const job = $(element);
      const position = job.find(".base-search-card__title").text().trim() || "";
      const company =
        job.find(".base-search-card__subtitle").text().trim() || "";
      const location =
        job.find(".job-search-card__location").text().trim() || "";
      const date = job.find("time").attr("datetime") || "";
      const salary =
        job
          .find(".job-search-card__salary-info")
          .text()
          .trim()
          .replace(/\n/g, "")
          .replaceAll(" ", "") || "";
      const jobUrl = job.find(".base-card__full-link").attr("href") || "";
      const companyLogo =
        job.find(".artdeco-entity-image").attr("data-ghost-url") || "";
      const agoTime =
        job.find(".job-search-card__listdate").text().trim() || "";
      return {
        position: position,
        company: company,
        companyLogo: companyLogo,
        location: location,
        date: date,
        agoTime: agoTime,
        salary: salary,
        jobUrl: jobUrl,
      };
    })
    .get();

  return jobObjects;
}

module.exports = { query };
