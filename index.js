const puppeteer = require('puppeteer');
const merge = require('easy-pdf-merge');
const path = require('path');
const fs = require('fs');
const rm = require('rimraf');

const iosguidetopdf = async (indexPageUrl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(indexPageUrl,{waitUntil: 'networkidle2'});
    await page.waitForSelector('#toc li');
    //get title 
    let guideTitle = await page.evaluate(()=> {
        return document.querySelector('#title h1').innerText
    })
    //get all pages
    let allPages = await page.evaluate(() => {
        var allLinks =  [...document.querySelectorAll('#toc>li>span>a')];
        return allLinks.map((a) => {
            return {
                href: a.href.trim(),
                text: a.innerText.trim()
            }
        })
    });
    //create folder if necessary
    const folderPath = guideTitle + "/";
    const isFolderExists = fs.existsSync(folderPath);
    if(!isFolderExists){
        fs.mkdirSync(folderPath)
    }
    //download every page in pdf
    var allPdfFiles = []
    for(var i in allPages) {
        let fileName = "00".substring(0,2-i.length)+i +"."+allPages[i].text+".pdf";
        allPdfFiles.push(folderPath + fileName);
        await page.goto(allPages[i].href, {waitUntil:'networkidle2'});
        await page.pdf({path: folderPath + fileName, format: 'A4'});
    }
    //merge into one pdf
    merge(allPdfFiles, folderPath + 'merged.pdf',function(err){
        if(err) return console.log(err);
        console.log('Done!');
    });
    await browser.close();
};
module.exports = iosguidetopdf
