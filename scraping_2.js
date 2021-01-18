const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = []




// var requestAsync = function (url) {
//   return new Promise((resolve, reject) => {
//     var req = request(url, (err, response, body) => {
//       if (err) return reject(err, response, body);
//       resolve(JSON.parse(body));
//     });
//   });
// };

// var getParallel = async function () {
//   //transform requests into Promises, await all
//   try {
//     var data = await Promise.all(urls.map(requestAsync));
//   } catch (err) {
//     console.error(err);
//   }
//   fs.writeFile('data.json', JSON.stringify(data), function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log('Saved');
//   });
// };

// getParallel();


const fetchData = async (url) => {

  const finaldata = await fetch(
    url)
    .then((res) => res.text())
    .then((data) => {
      const $ = cheerio.load(data)
      obj = {}

      obj.name = $('h1').text() ? $('h1').text() : "N/A"
      obj.tel = $("a[href^='tel:']").text() ? $("a[href^='tel:']").text() : "N/A"
      obj.web = $("a[href^='http:']").text() ? $("a[href^='http:']").text() : "N/A"
      obj.address = $("li em.fa-map-marker").parent().text().trim() ? $("li em.fa-map-marker").parent().text().trim() : "N/A"


      return obj

    })
  return finaldata
}



var scrape = async function () {
  let counter = 0
  let dataArr = []
  for (let i = 0; i < urls.length; i++) {
    if (counter <= 10) {
      let obj = await fetchData(urls[i])
      obj.id = i
      dataArr.push(obj)
      counter++
    }
    else {
      let obj = await fetchData(urls[i])
      obj.id = i
      dataArr.push(obj)
      console.log("Saving...", "Index at ", i)
      fs.writeFile('spi_data.json', JSON.stringify(dataArr), function (err, data) {
        if (err) {
          return console.log(err);
        }
        console.log('Saved');
      });
      counter = 0
    }

  }

}


scrape().then(() => console.log("Done!"))
