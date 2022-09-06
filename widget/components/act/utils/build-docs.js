const fs = require('fs');
const path = require('path');

const {Parser} = require('mark-to-jsonml');
const parser = new Parser();


let readme = `# ACT组件文档

---

> 文档已经迁移到各组件所在的文件夹中。\n\n`;

const actRoot = path.resolve(__dirname, '../');


const components = fs.readdirSync(actRoot).filter(item => item.startsWith('a-'));
let total = 0;
components.forEach(com => {
    const md = `${actRoot}/${com}/readme.md`;
    try {
        const parsed = parser.parse(fs.readFileSync(md).toString());
        readme += (`## [${parsed[2][2]}](./${com})  \n\n \` 组件介绍 \` ${parsed[4][1]}\n\n \` 文档链接 \` [./${com}/readme.md](./${com}/readme.md) \n\n \` 最近更新 \` ${fs.statSync(md).mtime.toLocaleString()} \n\n`);
        total++;
    } catch (e) {

    }
})


fs.writeFileSync(path.resolve(__dirname, '../readme.md'), readme);
console.log(`[${new Date().toLocaleString()}] 封面文档已经生成，共生成 ${total} / ${components.length} 个。`)

