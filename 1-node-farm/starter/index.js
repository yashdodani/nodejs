const fs = require("fs"); // fs = file system
const http = require("http");
const url = require("url");

// USING OUR OWN MODULES
const replaceTemplate = require("./modules/replaceTemplate");

// USING 3RD PARTY MODULES
const slugify = require("slugify");

//////////////////////////////////////
// FILES

// const hello = "hello world";
// console.log(hello);

/*
// BLocking, synchronous way
const textIn = fs.readFileSync(`${__dirname}/txt/input.txt`, "utf-8");
console.log(textIn);

const textOut = `this is what we know avacado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync(`${__dirname}/txt/output.txt`, textOut);
console.log("File has been writtern");


// Non BLocking, Asynchronous way
fs.readFile(`${__dirname}/txt/start.txt`, "utf-8", (err, data1) => {
  if (err) return console.log("ERROR");

  //   console.log(data1);
  fs.readFile(`${__dirname}/txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`${__dirname}/txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile(
        `${__dirname}/txt/final.txt`,
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          console.log("YOur file has been written");
        }
      );
    });
  });
});
console.log("Will read file");
*/

///////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

// slugify example
console.log(slugify("Fresh Avacados", { lower: true }));

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, url);
  // const pathname = req.url;

  // Overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObject
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    // console.log(cardHtml);

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    // console.log(query);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      // always before response
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
