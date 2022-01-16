import fs from 'fs'
import path from 'path'
import axios from 'axios'

let photoPath = 'D:\\papers'
let requestUrl = 'http://papertr.market.alicloudapi.com/sjsxcc'
let appCode = 'APPCODE 9173cbcf842342f4ad527d4c19b03f**' //aliyun cloud market api

let resultDir = path.join(photoPath, 'res')
if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir)
}
let files = fs.readdirSync(photoPath)


files.forEach(file => {
    let fullFile = path.join(photoPath, file)
    if (fs.statSync(fullFile).isDirectory()) {
        return;
    }
    let readFile = fs.readFileSync(fullFile)
    let fileBase64 = Buffer.from(readFile, 'binary').toString('base64')
    axios.post(requestUrl, {
        media_id: fileBase64
    }, {
        headers: {
            "Content-Type": 'application/json;charset=UTF-8;',
            "Authorization": appCode
        }
    }).then(res => {
        let imgData = res.data.data.media_id
            // let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        let dataBuffer = Buffer.from(imgData, 'base64');
        fullFile = path.join(photoPath, 'res', file)
        fs.writeFile(fullFile, dataBuffer, function(err) {
            if (err) {
                console.log("写入失败：" + file)
            } else {
                console.log("写入成功:" + file);
            }
        });
    })
})