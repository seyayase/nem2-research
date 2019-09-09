'use strinct';
const base32Decode = require('base32-decode');
const fs = require('fs');

// ファイルを読み込み
const file = fs.readFileSync("../../data/arts/girl.txt.gz", {encodeing: "utf-8"});

// base32でデコード
const decodeText = base32Decode(file.toString(), 'Crockford');

fs.writeFileSync('./nice-aa-gzip-base32-return-gzip.txt.gz', new Buffer.from(decodeText));
