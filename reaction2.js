/*
* Chimp Memory Test
*
*/

const PORT = 8000
// import modules
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const url = 'https://humanbenchmark.com/tests/chimp'

// set max
const max = 40

const scrapeData = async () => {
  const browser = await puppeteer.launch({headless: false, args: ['--start-maximized']})
  const page = await browser.newPage();
  const initHTML = cheerio.load(await page.content());

  // Get window size
  const { width, height } = await page.evaluate(() => {
    return {
      width: window.outerWidth,
      height: window.outerHeight
    };
  });

  // Set viewport size to match window size
  await page.setViewport({ width, height });
  console.log("waiting for networkidle2")
  
  // await Promise.race([
  //   page.goto(url, { waitUntil: 'networkidle2' }),
  //   new Promise((resolve) => setTimeout(resolve, 2000))
  // ]);
  // console.log("networkidle2 done")
  // await (delay(15000))

  await Promise.race([
    page.goto(url, { waitUntil: 'networkidle2' }),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ]);
  console.log("networkidle2 done") 
  
  console.log("waiting for initClick")
  await page.waitForSelector('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button')
  const initTest = await page.$('#root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div:nth-child(2) > button')
  await (delay(10000)) 
  await initTest.click()
  console.log("initialized test - total: "+total)

 
 // #root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div > div > div:nth-child(3) > div:nth-child(6) 
 // #root > div > div:nth-child(4) > div.css-12ibl39.e19owgy77 > div > div.desktop-only > div > div > div:nth-child(3) > div:nth-child(5)
 // <div data-cellnumber="4" class="css-19b5rdt"><div>4</div></div> 
 // [data-cellnumber="${cellNumber}"]
  var total = 4
  for(total;total<=max;total++){
    var i = 1
    var cells = [...Array(max+1).keys()].map(i => `[data-cellnumber="${i}"]`)
    for(i=1;i<=total;i++){
      // const currentCell = `[data-cellnumber="${i}"]`;
      // await page
      //   .waitForSelector(currentCell)
      // const reactClick = 
      await (await page.$(cells[i])).click()
      //await reactClick.click()
      console.log("clicked #"+i+" - " + cells[i])
    }
    console.log("Test ended - total: "+total)

    console.log("Waiting...")
    //await delay(4000);
    await page.waitForSelector('.e19owgy710')
    const continueTest = await page.$('.e19owgy710')
    if(total<max){ 
      await continueTest.click()
    }
  }
}; 
 
function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

scrapeData().catch(err => console.log(err));

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});