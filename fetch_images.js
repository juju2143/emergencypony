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

for(season=config.downloader.start;season<=config.downloader.end;season++)
{
    w.pagesInCategory(`Category:Season ${season} episode galleries`).then(pages => {
        //pages = [pages[0]];
        pages.forEach(gallery => {
            var episode = gallery.split("/")[0];
            var path = `${config.images}/${episode}/`;
            fs.mkdirSync(path, {recursive: true}, err => {});
            w.page(gallery).then(page => page.rawImages()).then(images => {
                images.forEach(image => {
                    var img = path+image.title.replace("File:","");
                    var url = image.imageinfo[0].url;
                    downloads.push({url: url, path: img});
                });
            });
        });
    });
}

var timer = setInterval(() => {
    var dls = downloader.getDownloads().filter(d => (d.status == 1));
    if(downloads.length > 0 && dls.length < config.downloader.maxDownloads)
    {
        do
        {
            var d = downloads.pop();
            try
            {
                var stats = fs.statSync(d.path);
            }
            catch(e)
            {
                var stats = false;
                //if(d) console.log('⭕️ '+d.path+' exists, skipping...')
            }
        }
        while(!stats || stats.size == 0);

        var dl = downloader.download(d.url, d.path);
        dl.on('start', function() {
            console.log('✅ '+d.path+' - Download started!');
        });
        dl.on('error', function() {
            console.log('💢 '+d.path+' - Download error!');
            console.log(dl.error);
            downloads.push(d);
        });
        dl.on('end', function() {
            var stats = dl.getStats();
            console.log('🏁 '+d.path+' - Download finished! '+stats.total.size+' bytes');
            dl.stop();
        });
        dl.on('retry', function() {
            console.log('⚠️ '+d.path+' - Download error, retrying...');
        });
        dl.on('stopped', function() {
            //console.log('⏹ '+d.path+' - Download stopped.');
        });
        dl.on('destroyed', function() {
            console.log('❌ '+d.path+' - Download destroyed.');
        });
        dl.start();

        if(downloads.length == 0) clearInterval(timer);
    }
}, config.downloader.interval);