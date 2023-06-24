const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express()
app.use(express.json());
app.use(cors());
const PORT = 8080

app.get('/', async(req, res) => {
  res.send("Hello, I am from Alberto")
})

app.post('/compare', async (req, res)=>{
  const { product } = req.body;
  const response = await compareProducts(product)
  res.json({response})
})

app.listen(PORT, () => {console.log(`Listening at the Port ${PORT}`)})


const compareProducts = async (item) => {
  
  var result = []

  // ********************************  Alberto Torresi  ************************
  
   try {
    const response = await axios.get(`https://www.albertotorresi.com/search?q=${item}*&type=product`);
    console.log("EEllooo")
        const html = response.data;
        const $ = cheerio.load(html);
        
        // ================= Scrape Product Info ====
        const productDivs = $('.ProductItem__Info.ProductItem__Info--center');
        let productArr = [];
        productDivs.each((_, element) => {
          const productInfo = $(element).text().trim();
        productArr.push(productInfo)
      });

        // ******************************* Extract Data from Array *******************
        const extractData = (productArr) => {
          const extractedData = [];
          
          const regex = /(.+)\n\s+₹ ([\d,]+)\n\s+₹ ([\d,]+)/;
          
          productArr.forEach((item) => {
            const match = regex.exec(item);
            if (match) {
              const name = match[1].trim();
              const originalPrice = match[2].replace(/,/g, '');
              const discountedPrice = match[3].replace(/,/g, '');
              
              extractedData.push({ name, originalPrice, discountedPrice });
            }
          });
          
          return extractedData;
        };
        
        const extractedData = extractData(productArr)
    
        // ============= Scrape Image URL's ===
        const imgElements = $('.ProductItem__Image.ProductItem__Image--alternate');
        let imgArr = [];
        const imgData = imgElements.map((index, element) => {
          const src = $(element).attr('data-src');
          const updatedSrc = src.replace('{width}', 800);
          const alt = $(element).attr('alt');
            imgArr.push({ updatedSrc, alt })
        }).get();
    
        for(let i=0; i< extractedData.length; i++) {
          extractedData[i].imgsUrl = imgArr[i]?.updatedSrc
          extractedData[i].imgsAlt = imgArr[i]?.alt
        }
    
        
        result.push(extractedData);

  } catch (error) {
    console.error('Error:', error);
  }
  // ********************************  Red Chief  ************************
 
  try {
    const response = await axios.get(`https://www.redchief.in/redchiefb2c/faces/fe/tiles/pages/search.jsp?searchkey=${item}`);
    const html = response.data;
        const $ = cheerio.load(html);
        
        const imageURL = $('.thumbImg img')
        const productTitle = $('.productBox h2 a span')
        const offerPrice = $('.productBox .offerPrices.prize')
    
        // ========== Scrape Product Name ===
        let itemArr = [];
        productTitle.each((_, element) => {
          const productInfo = $(element).text();
          itemArr.push(productInfo)
        });
    
        // ========== Scrape Product Price ===
        let priceArr = [];
        offerPrice.each((_, element) => {
          let price = $(element).text().trim();
          priceArr.push(price)
        });
    
        // ========== Scrape Image URL ===
        let imgArr = [];
        imageURL.each((_, element) => {
          const imgData = $(element).attr('src');
          imgArr.push(imgData)
        });
    
        let infoArr = []
    
    for(let i = 0; i <itemArr.length; i++) {
      const prices = priceArr[i].split(' ');
      const originalPrice = prices[0] + prices[1];
      const discountPrice = prices[2] + prices[3];
        let obj = {
            item: itemArr[i],
            originalPrice: originalPrice,
            discountPrice: discountPrice,
            imaUrl: imgArr[i],
        }
        infoArr.push(obj)
    }
    
      result.push(infoArr);

  } catch (error) {
    console.error('Error:', error);
  }

    // console.log("Result Finall Data ==>>", result);
    return result
}
