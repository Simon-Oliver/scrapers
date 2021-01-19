const fetch = require('node-fetch');
const fs = require('fs');

var donwloadVideo = async (url, name) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(`./videos/${name}.mp4`, buffer, () =>
        console.log('finished downloading video!'));
}

donwloadVideo("https://gronda.eu/media/5gnJ2tKAVN/stories/1vd.mp4")