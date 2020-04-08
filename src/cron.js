const CronJob = require('cron').CronJob;
const { getURL, postURL } = require('./request')
var read = require('./readability');

const job = new CronJob('*/1 * * * *', function () {
    try {
        console.log("Chạy lại 1 phút - Andiezz");
        handle()
    } catch (error) {
        console.log(error.message);

    }
}, null, true, 'America/Los_Angeles');

const handle = async () => {

    let data = await getURL()
    if (data.status == 'error') {
        throw new Error(data.message)
    }
    let { url, _id } = data.data
    //

    read(`${url}`,
        async function (err, article, meta) {
            var dom = article.document;
            var html = '<html><head><meta charset="utf-8"><title>' + dom.title + '</title></head><body><h1>' + article.title + '</h1>' + article.content + '</body></html>';
            let postData = {
                id: _id,
                title: article.title,
                content: article.content
            }
            await postURL(postData)

        });
    //

}

job.start();
