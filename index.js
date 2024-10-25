const PORT = 8000
// import modules
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const url = 'https://booking.carleton.ca/index.php?p=RoomSearch&r=1'

const scrapeData = async () => {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.click('#tpgTimeline.tabLeft')
  
  await page.waitForSelector('#uhid1')
  console.log('#uhid1 loaded')
  // Simulate hover action
  await page.hover('#uhid1')
  console.log('Hovered over #uhid1')

  // Click the dropdown to ensure it is initialized
  await page.click('#uhid1')
  console.log('Clicked #uhid1')

  // Select the option
  await page.select('#uhid1', '1000')
  console.log('Selected 1000 in #uhid1')
 
  // Wait for an element that appears as a result of the change
  await page.waitForFunction(() => document.querySelector('#uhid1').value === '1000');
 
  try{
    await page.waitForSelector('.TimelineViewBlock')
    
    const html = await page.content();
    const $ = cheerio.load(html);
    const articles = []

    //console.log(html)

    $('.TimelineViewBlock').each(function(){
      const blockHTML = $(this).html();
      const lines = blockHTML.split('<br>').map(line => cheerio.load(line).text().trim())
      const popupDataHTML = $(this).find('.popupData').html();
      const info = cheerio.load(popupDataHTML.split('<br>')[0]).text().trim()
      console.log(lines[3])
      const title = lines[0]
      const time = lines[1]
      const id = lines[2]
      const rooms = lines[3].replace(info, '');
      articles.push({
        title, time, rooms, info
      })
      // console.log(info)
    })
    console.log(articles);
  }
  catch(error){
    const html = await page.content();
    console.log(html)
    console.error('Error waiting for selector:', error)
  }
  finally{
    await browser.close();
  }
};

scrapeData().catch(err => console.log(err));

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)});