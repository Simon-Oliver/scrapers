//const urls = require("./error.json")
const fetch = require('node-fetch');
const fs = require('fs');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');



const urls = []


function chunkArray(array, size) {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

// returns username
const getData = (user, url) => {
  const obj = {}
  obj.url = url
  try {
    const $ = cheerio.load(user);
    obj.address = $("div[id='address']").text() ? $("div[id='address']").text().trim().replace(/\n/g, '') : 'N/A';
    obj.name = $(".title-node").text() ? $(".title-node").text() : 'N/A';
    obj.phone = $('a[id="contact-tel"]').attr('href') ? $('a[id="contact-tel"]').attr('href').replace("tel:", "") : 'N/A';
    obj.email = $('a[id="contact-mail"]').attr('href') ? $('a[id="contact-mail"]').attr('href').replace("mailto:", "") : 'N/A';
    obj.web = $('div[id="websitewrapper"] > a[id="contact-tel"]').attr('href') ? $('div[id="websitewrapper"] > a[id="contact-tel"]').attr('href') : 'N/A';
    // const el = $('.eventbox__address').text()
    // obj.address = el.trim().split("\n").map(e => e.replace(/\s+/g, " ").trim()).filter(e => e != "").join(",")
    // obj.tel = $("div[title=\"Telefon\"]").text().split("\n").map(e => e.replace(/\s+/g, " ").trim()).filter(e => e != "")
    // obj.email = $(".link.link--mail").attr("href").replace("mailto:", "")
    // obj.web = $(".link.link--external").attr("href")
  }
  catch (error) {
    obj.error = true
  }




  //   let obj = {
  //     name: user.name,
  //     company: user.company.name,
  //   };
  return obj;
};

// Gets url and runs getData on json
let getUser = async (url) => {
  const finaldata = await fetch(url)
    .then((res) => res.text())
    .then((data) => {
      return getData(data, url)
    })
    .catch((e) => console.log('-------->', e));
  return finaldata;
};

// Takes an array of urls and maps them agains getUser methode and awaits them
let scrape = async (urls) => {
  const data = await Promise.all(urls.map((e) => getUser(e)));
  return data;
};

let savingToFile = (fileName, data) => {
  fs.writeFile(fileName, JSON.stringify(data), (err, saved) => {
    if (err) {
      return console.log(err);
    }
    console.log('Saved');
  });
};

// breaks url arry into chuncks and runs scrape for each chunk and awaits befor appending to return arr
const batchScrape = async (list, num) => {
  const batch = chunkArray(list, num);
  let arr = [];

  // for (const [key, value] of batch.entries()) {
  //   d = await scrape(value);
  //   savingToFile('testDataSave.json', [...arr, ...d]);
  //   arr = [...arr, ...d];
  // }

  for (let b of batch) {
    d = await scrape(b);
    console.log([...arr, ...d])
    savingToFile('rk.json', [...arr, ...d]);
    arr = [...arr, ...d];
  }

  // for (let i = 0; i < batch.length; i++) {
  //   d = await scrape(batch[i]);
  //   arr = [...arr, ...d];
  // }

  return arr;
};

class CreateCSV {
  constructor(headings, data) {
    this.headings = headings
    this.headStr = headings.join()
    this.data = data
  }

  getHeadings() {
    return this.headings
  }

  getStrHeadings() {
    return this.headStr
  }

  getCSV() {
    let csvStr = ""
    csvStr += this.headStr
    this.data.forEach(d => {
      let str = "\n"
      this.headings.forEach(h => {
        str += d[h] + ","
      })
      csvStr += str.replace(/,\s*$/, "") // Removes the trailing comma and whitespace
    })
    return csvStr
  }

}


batchScrape(urls, 25).then(async (d) => {
  //console.log(await new ObjectsToCsv(d).toString())
  //console.log(new CreateCSV(["name","company"],d).getCSV())
  console.log("Done")
});