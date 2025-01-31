const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url != "/") {
    return res.end();
  }

  // Bad practice all files load at once causing high memory comsumtion
  /* const file = fs.readFileSync("data.txt");
  return res.end(file); */

  // Downloading big file using streams
  /* const readableStream = fs.createReadStream("data.txt");
  // readableStream -> writeableStream ( -> = pipe );
  readableStream.pipe(res); */

  // Streaming video
  /* const readableStream = fs.createReadStream("video.mp4");
  res.writeHead(200, {
    "Content-Type": "video/mp4",
  });
  readableStream.pipe(res); */
  
  // Copying file bad way
  /* const file = fs.readFileSync("data.txt");
  fs.writeFileSync("output.txt", file);
  res.end(); */
  // Copying file  good way 
  /* const readStream = fs.createReadStream("data.txt");
  const writeStream = fs.createWriteStream('output.txt');
  readStream.on('data', (chunk) => {
    console.log("chunk",chunk);
    writeStream.write(chunk);
  })
  res.end(); */
  //writeableStream.pipe(res)
});

const PORT = 8000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
