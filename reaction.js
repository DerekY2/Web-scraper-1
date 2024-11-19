const PORT = 8000
// import modules
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const url = 'https://humanbenchmark.com/tests/reactiontime'

const scrapeData = async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage();
  const initHTML = cheerio.load(await page.content());
  console.log("waiting for networkidle2")
  await Promise.race([
    page.goto(url, { waitUntil: 'networkidle2' }),
    new Promise((resolve) => setTimeout(resolve, 2000))
  ]);
  console.log("networkidle2 done")

  console.log("waiting for initClick")
  await page.waitForSelector('#root > div > div:nth-child(4) > div.view-splash.e18o0sx0.css-saet2v.e19owgy77')
  const initTest = await page.$('#root > div > div:nth-child(4) > div.view-splash.e18o0sx0.css-saet2v.e19owgy77')
  await initTest.click()
  console.log("initialized test")
 
 
  while (true){
    await page
      .waitForSelector('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77')
    const reactClick = await page.$('#root > div > div:nth-child(4) > div.view-go.e18o0sx0.css-saet2v.e19owgy77')
    await reactClick.click()
    console.log("clicked")
  }
}; 

scrapeData().catch(err => console.log(err));

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});