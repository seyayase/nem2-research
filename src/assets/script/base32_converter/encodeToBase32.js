'use strinct';
const base32Encode = require('base32-encode');
const fs = require('fs');

// ファイルを読み込み
const file = fs.readFileSync("../../data/arts/flower.txt.gz");

// base32でエンコード
const base32Text = base32Encode(file, 'Crockford');

fs.writeFileSync('../../data/arts/flower-txt-gzip-base32.txt', base32Text);
