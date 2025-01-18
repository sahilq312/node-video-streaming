// Importing required modules from Node.js
import express from "express"; // Express framework for building the web server.
import { createReadStream, statSync } from "fs"; // 'createReadStream' for streaming file content, 'statSync' for file information.
import { dirname } from "path"; // 'dirname' to get the directory name of a file.
import { fileURLToPath } from "url"; // 'fileURLToPath' to convert a URL to a file path.

// Resolving __dirname and __filename for ES modules (not available natively like in CommonJS)
const __filename = fileURLToPath(import.meta.url); // Converts the current module's URL to a file path.
const __dirname = dirname(__filename); // Extracts the directory name of the current file.

// Initialize the Express app
const app = express();
const PORT = 3000; // The port on which the server will listen for requests.

// Define a route to handle requests for video streaming
app.get("/video", (req, res) => {
    const file = `${__dirname}/public/video.mp4`; // Path to the video file to be streamed.
    const stat = statSync(file); // Retrieves information about the file, such as its size.
    const fileSize = stat.size; // Total size of the video file in bytes.
    const range = req.headers.range; // The 'Range' header from the client's request, which specifies the part of the file to stream.

    // If the Range header is not provided, return a 416 (Range Not Satisfiable) status.
    if (!range) {
        return res.status(416).send("Requires Range header");
    }

    const chunkSize = 10 ** 6; // Size of each video chunk (1 MB).
    const start = Number(range.replace(/\D/g, "")); // Extracts the starting byte position from the Range header.
    const end = Math.min(start + chunkSize - 1, fileSize - 1); // Calculates the ending byte position.

    const contentLength = end - start + 1; // Length of the chunk to be sent.
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`, // Specifies the range of bytes being sent.
        "Accept-Ranges": "bytes", // Indicates support for byte-range requests.
        "Content-Length": contentLength, // Length of the response body.
        "Content-Type": "video/mp4", // MIME type of the video file.
    };

    res.writeHead(206, headers); // Sends a 206 (Partial Content) status with the headers.

    const fileStream = createReadStream(file, { start, end }); // Creates a readable stream for the specified byte range.
    fileStream.pipe(res); // Pipes the stream to the response, sending the video chunk to the client.
});

// Start the Express server and listen on the specified port.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Logs a message when the server starts successfully.
});
