const fetch = require('node-fetch');
const fs = require('fs');
const puppeteer = require("puppeteer");
const emojiStrip = require("emoji-strip")
const request = require('request');
const https = require("https")

const { isValidHttpUrl } = require("./utils/helper.js")



const urls = []

process.argv.slice(2).forEach(e => {
    if (isValidHttpUrl(e)) {
        urls.push(e)
    }
})


async function download(url, dest) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(dest, buffer, () =>
        console.log('finished downloading!'));
}

var saveRecipes = async (data) => {
    const text = `
    # ${data.title}

    ${data.content}

    #_privat/Cooking/Recipe
    `
    const name = emojiStrip(data.title).trim().replace(" ", "_").toLocaleLowerCase()
    fs.writeFile(`./recipes/${name}.md`, text, () =>
        console.log('finished downloading recipe!'));
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
        try {
            const title = document.querySelector("h1").innerText ? document.querySelector("h1").innerText : " ";
            const videUrl = document.querySelector("video source").getAttribute("src") != null ? document.querySelector("video source").getAttribute("src") : " "
            const content = document.querySelector("figcaption div + p").textContent ? document.querySelector("figcaption div + p").textContent : " "
            const fileTitle = title.replace(" ", "_") ? title.replace(" ", "_") : ""

            return {
                title, videUrl, content, fileTitle, title
            };

        } catch (error) {
            console.log(error)
        }
    });

    let name
    if (data) {
        name = data.title != undefined ? emojiStrip(data.title).trim().replace(" ", "_").toLocaleLowerCase() : " "
        download(data.videUrl, `./videos/${name}.mp4`)
        // await pDownload(videoUrl, `./videos/${name}.mp4`)
        await saveRecipes(data)
    } else {
        console.log(url)
    }



    // Here we can do anything with this data
    // We close the browser
    await browser.close();
}







const data = Promise.all(urls.map((e) => scrape(e)))
// donwloadVideo("https://gronda.eu/media/5gnJ2tKAVN/stories/1vd.mp4")