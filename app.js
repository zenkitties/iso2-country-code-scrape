// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const url = 'https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2';


const scrapeData = async () => {
  try {
    // Fetch HTML of the page we want to scrape
    const { data } = await axios.get(url);
    // Load HTML we fetched in the previous line
    const $ = cheerio.load(data);
    // Select all the tr items
    const listItems = $('.wikitable tbody tr')
    // Store data for all countries
    const countries = [];
    // Use .each method to loop through the li we selected.
    listItems.each((idx, el) => {
      // Object holding data for each country/jurisdiction
      const country = { name: '', iso2: '', selected: false};
      // Select the text content of span and a elements
      // Store the textcontent in the above object
      country.name = $(el).children('td:nth-child(2)').text();
      country.iso2 = $(el).children('td:nth-child(1)').text();
      // Populate countries array with country data
      countries.push(country);
      
    });
    // Logs countries array to the console
    console.dir(countries);
    // Write countries array in countries.json file
    fs.writeFile('countries.json', JSON.stringify(countries, null, 2 ), (err) => {
      if(err) {
        console.error(err);
        return;
      }
      console.log('Successfully written data to file!')
    });
  } catch (err) {
    console.error(err);
  }
}

// Invoke the above function
scrapeData();