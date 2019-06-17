var fs = require('fs');
const config = require("./config.json");

var episodes = fs.readdirSync(config.images);
episodes.forEach(episode => {
    var isDir = fs.statSync(config.images+"/"+episode).isDirectory();
    if (!isDir) return;
    var pictures = fs.readdirSync(config.images+"/"+episode);
    pictures.forEach(picture => {
        var stats = fs.statSync(config.images+"/"+episode+"/"+picture);
        if(stats.size == 0)
        {
            fs.unlinkSync(config.images+"/"+episode+"/"+picture)
        }
    })
    var pictures = fs.readdirSync(config.images+"/"+episode);
    if(pictures.length == 0)
    {
        fs.rmdirSync(config.images+"/"+episode);
    }
})