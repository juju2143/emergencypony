var fs = require('fs');
var Twit = require('twit');
const config = require("./config.json");

module.exports = class Utils
{
    static tweet()
    {
        var T = new Twit(config);

        do
        {
            console.log("Finding a picture to tweet...");
            try
            {
                var episodes = fs.readdirSync(config.images);
                var episode = episodes[Math.floor(Math.random() * episodes.length)];
                var pictures = fs.readdirSync(config.images+"/"+episode).filter(pic => pic.endsWith(".png"));
                if(pictures.length == 0) content = "";
                else
                {
                    var picture = pictures[Math.floor(Math.random() * pictures.length)];
                    var content = fs.readFileSync(config.images+"/"+episode+"/"+picture, { encoding: 'base64' });
                }
            }
            catch(e)
            {
                content = "";
            }
        }
        while(content == "");
    
        console.log("Uploading picture...");
        T.post('media/upload', {
            media_data: content
        }, function (err, data, response) {
            if(err) console.log(err);
            else
            {
                console.log('Sending tweet...');
                T.post('statuses/update', {
                    media_ids: new Array(data.media_id_string),
                    status: episode
                }, function(err, data, response) {
                    if(err) console.log(err);
                    else console.log('Tweet sent! '+ data.entities.urls[0].url);
                });
            }
        });
    }
}