
//FILE SYSTEMS
const fs = require("fs");
///CREATING A SERVER AND ROUTING AND APIs
//require the http module 
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate")
const slugify = require("slugify")

//API FILE READ ONCE SYNCHRONOUSLY
/////FIRST/HIGHER ORDER CODE.
const tempOverview = fs.readFileSync("./templates/overview.html", "utf-8")
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8")
const tempProduct = fs.readFileSync("./templates/template-product.html", "utf-8")

// read data from json file and parse in javascript objects.
const data = fs.readFileSync("./dev-data/data.json", "utf-8")
const dataObj = JSON.parse(data);
console.log(dataObj)
const slugs = dataObj.map(elem => slugify(elem.productName, { lower: true }));
console.log(slugs)//tobe used later to replace the id in thr data .json file.

const server = http.createServer((req, res) => {
   const { query, pathname } = url.parse(req.url, true);
   //ROUTING...
   if (pathname === "/" || pathname === "/overview") {
      res.writeHead(800, { "content-type": "text/html" });
      const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
      console.log(cardsHtml);
      const finalOutput = tempOverview.replace(/{%PRODUCTS_CARDS%}/g, cardsHtml);
      res.end(finalOutput);
   }
   //product
   else if (pathname === "/product") {
      const product = dataObj[query.id]
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
      //API
   } else if (pathname === "/API") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(data);
      //ERROR
   } else {
      //the headers need to be sent before response. 
      res.writeHead(404, {
         "content-type": "text/html"
      });
      res.end("<h1>page not found</h1>") //404 status code.
   }
})
server.listen(8000, '127.0.0.1', () => {
   console.log("listening to requests on port 8000")
})




