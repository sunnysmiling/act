const fs = require('fs');
const icons = fs.readFileSync('./fonts/iconfont.css').toString();
const regex = /.icon-(.*):before {\n\s*content:.*"\\(.*)"/g;
const matches = new Set();
while (regex.exec(icons)) {
    matches[RegExp.$1] = "★u" + RegExp.$2;
}

fs.writeFileSync('./dist/icons.json', JSON.stringify(matches).replace(/★/g, '\\'));
console.log('\n ☺  build finished !')