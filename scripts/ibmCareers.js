const axios = require('axios');

function calculateDaysAgo(dateTimeString) {
    const givenDate = new Date(dateTimeString);
    const currentDate = new Date();
    const timeDifference = currentDate - givenDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));    
    return daysAgo;
}

async function getIBMJobsAPI() {
    try {
        const url = "https://www-api.ibm.com/search/api/v2";
        const payload = {
            "appId": "careers",
            "scopes": ["careers"],
            "query": {
              "bool": {
                "must": [
                  {
                    "simple_query_string": {
                      "query": "intern",
                      "fields": ["keywords^1", "body^1", "url^2", "description^2", "h1s_content^2", "title^3", "field_text_01"]
                    }
                  }
                ]
              }
            },
            "aggs": {
              "field_keyword_172": {
                "filter": {
                  "match_all": {}
                },
                "aggs": {
                  "field_keyword_17": {
                    "terms": {
                      "field": "field_keyword_17",
                      "size": 6
                    }
                  },
                  "field_keyword_17_count": {
                    "cardinality": {
                      "field": "field_keyword_17"
                    }
                  }
                }
              },
              "field_keyword_083": {
                "filter": {
                  "match_all": {}
                },
                "aggs": {
                  "field_keyword_08": {
                    "terms": {
                      "field": "field_keyword_08",
                      "size": 6
                    }
                  },
                  "field_keyword_08_count": {
                    "cardinality": {
                      "field": "field_keyword_08"
                    }
                  }
                }
              },
              "field_keyword_184": {
                "filter": {
                  "match_all": {}
                },
                "aggs": {
                  "field_keyword_18": {
                    "terms": {
                      "field": "field_keyword_18",
                      "size": 6
                    }
                  },
                  "field_keyword_18_count": {
                    "cardinality": {
                      "field": "field_keyword_18"
                    }
                  }
                }
              },
              "field_keyword_055": {
                "filter": {
                  "match_all": {}
                },
                "aggs": {
                  "field_keyword_05": {
                    "terms": {
                      "field": "field_keyword_05",
                      "size": 1000
                    }
                  },
                  "field_keyword_05_count": {
                    "cardinality": {
                      "field": "field_keyword_05"
                    }
                  }
                }
              }
            },
            "size": 30,
            "lang": "zz",
            "localeSelector": {},
            "sm": {
              "query": "intern",
              "lang": "zz"
            },
            "_source": ["_id", "title", "url", "description", "language", "entitled", "field_keyword_17", "field_keyword_08", "field_keyword_18", "field_keyword_19"]
          };
        
        const response = await axios.post(url, payload);
        
        const jobPostingsData = [];
        const jsonData = response.data;

        if(jsonData && Array.isArray(jsonData.hits.hits)) {
            jsonData.hits.hits.forEach( job => {
                const location = job._source.field_keyword_19;
                const jobUrl = job._source.url;
                const date = ""; 
                const agoTime = ""; 
                const position = job._source.title;
                const company = "IBM";

                jobPostingsData.push({ position, company, location, jobUrl, date, agoTime });
            });
        }
        return jobPostingsData;
    } catch (error) {
        throw new Error('Error scraping IBM internship details: ' + error);
    }
}

module.exports = getIBMJobsAPI;
