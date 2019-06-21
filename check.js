const wiki = require('wikijs').default;
var fs = require('fs');
var Downloader = require('mt-files-downloader');
const config = require("./config.json");

const w = wiki({
    apiUrl: 'https://mlp.fandom.com/api.php',
    origin: null
});

var downloader = new Downloader();

var downloads = [];

var episodes = 0;
var pictures = 0;
var missing = 0;

var paths = [];

for(season=config.downloader.start;season<=config.downloader.end;season++)
{
    console.log(`Processing season ${season}...`);
    w.pagesInCategory(`Category:Season ${season} episode galleries`).then(pages => {
        episodes += pages.length;
        process.stdout.write(`\rChecking ${pictures} images in ${episodes} episodes... ${missing} missing or corrupt. `);
        pages.forEach(gallery => {
            var episode = gallery.split("/")[0];
            console.log(`Processing episode ${episode}...`);
            var path = `${config.images}/${episode}/`;
            w.page(gallery).then(page => page.rawImages()).then(images => {
                pictures += images.length;
                process.stdout.write(`\rChecking ${pictures} images in ${episodes} episodes... ${missing} missing or corrupt. `);
                images.forEach(image => {
                    var img = path+image.title.replace("File:","");
                    var url = image.imageinfo[0].url;
                    paths.push(img);
                    var stats = fs.stat(img, (err, stats)=>{
                        var a = false;
                        if(err) { missing++; a=true; }
                        else if(stats.size == 0) { missing++; a=true; }
                        if(a) process.stdout.write(`\rChecking ${pictures} images in ${episodes} episodes... ${missing} missing or corrupt. `);
                    });
                });
            }).catch(() => episode--);
        });
    });
}

process.on("exit", ()=>{
    console.log("done.");
    var paths2 = [];
    var episodes = fs.readdirSync(config.images);
    episodes.forEach(episode => {
        var isDir = fs.statSync(config.images+"/"+episode).isDirectory();
        if (!isDir) return;
        var pictures = fs.readdirSync(config.images+"/"+episode);
        pictures.forEach(str => paths2.push);
    })
    console.log(paths2.filter(x => !paths.includes(x)));
})