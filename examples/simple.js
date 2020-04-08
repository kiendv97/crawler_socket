var read = require('../src/readability');

read('https://vn.trangcongnghe.com/tin-ict/227962-xu-huong-chon-sim-so-dep-cac-dau-so-moi.html',
  function (err, article, meta) {
    var dom = article.document;
    var html = '<html><head><meta charset="utf-8"><title>' + dom.title + '</title></head><body><h1>' + article.title + '</h1>' + article.content + '</body></html>';
    console.log(html);
    // console.log(meta);
  });
