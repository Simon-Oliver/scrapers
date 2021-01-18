const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');
const puppeteer = require("puppeteer");
//const emojiStrip = require("emoji-strip")

var donwloadVideo = async (url, name) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(`./videos/${name}.mp4`, buffer, () =>
        console.log('finished downloading video!'));
}


const scrape = async (url, cb) => {
    // Launch the browser
    const browser = await puppeteer.launch();
    // Create an instance of the page
    const page = await browser.newPage();
    // Go to the web page that we want to scrap
    await page.goto(url);

    // Here we can select elements from the web page
    const data = await page.evaluate(() => {
        const title = document.querySelector("h1").innerText;
        const videUrl = document.querySelector("video source").getAttribute("src")
        const content = document.querySelector("figcaption div + p").textContent
        const fileTitle = title.replace(" ", "_")
        donwloadVideo(videUrl, title)

        return {
            title, videUrl, content, fileTitle, title
        };
    });

    // Here we can do anything with this data
    console.log(data)
    // We close the browser
    await browser.close();
}

scrape("https://gronda.eu/story/applefoamdku");

// donwloadVideo("https://gronda.eu/media/5gnJ2tKAVN/stories/1vd.mp4")