# Video Streaming Server

This project demonstrates a simple video streaming server using Node.js (Express) and a React frontend for playback. The backend streams video files in chunks to save memory and optimize performance, ensuring efficient video delivery to the frontend.

## How It Works

### Backend (Node.js + Express)
1. **Endpoint:**
   The backend exposes an API endpoint `/video` to serve video files. This endpoint uses the HTTP `Range` header to stream video in manageable chunks.

2. **Chunk-Based Streaming:**
   - When the browser requests the video, it sends a `Range` header specifying the portion of the file it needs.
   - The server reads and sends only the requested part of the file using the `fs.createReadStream` method.
   - This avoids loading the entire file into memory, reducing memory usage significantly, especially for large video files.

3. **Headers for Partial Content:**
   The server responds with HTTP status code `206 Partial Content` and includes headers such as:
   - `Content-Range`: Specifies the range of bytes being sent.
   - `Content-Length`: Indicates the size of the chunk.
   - `Accept-Ranges`: Tells the client that the server supports partial requests.

4. **Streaming Implementation:**
   ```javascript
   const chunkSize = 10 ** 6; // 1MB chunks
   const start = Number(range.replace(/\D/g, ""));
   const end = Math.min(start + chunkSize - 1, fileSize - 1);
   const fileStream = createReadStream(file, { start, end });
   fileStream.pipe(res);
   ```
   By streaming chunks of the file instead of loading the entire file into memory, the server remains efficient even with multiple concurrent users.

### Frontend (React)
1. **Video Player:**
   The React app includes a simple video player using the `<video>` HTML tag:
   ```javascript
   <video src="http://localhost:3000/video" controls width="800" />
   ```

2. **Streaming Playback:**
   When the video player requests playback, the browser sends a `Range` header to the backend. The backend processes the request and streams the requested chunk of the video. This process repeats as the browser requests more chunks during playback.

3. **Error Handling:**
   The frontend gracefully handles errors, ensuring the user is informed if the video fails to load.

## Why It Saves Memory
1. **Chunk-Based Delivery:**
   - The server reads and sends only small portions of the video file at a time, avoiding loading the entire file into memory.
   - This is particularly beneficial for large video files, as memory usage remains constant regardless of the file size.

2. **Scalability:**
   - By serving small chunks, the server can handle multiple concurrent video streams without a significant increase in memory usage.

3. **Efficient File Handling:**
   - The `fs.createReadStream` method streams data directly from the file system to the client, bypassing the need for intermediate buffering.

## How to Run the Project

### Prerequisites
- Node.js installed on your system
- A video file (`video.mp4`) placed in the `public` folder

### Backend Setup
1. Install dependencies:
   ```bash
   npm install express
   npm install cors
   ```

2. Run the server:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:3000`.

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the React app:
   ```bash
   npm start
   ```
   The app will open in the browser, and the video should be playable.

## Key Features
- **Memory Efficiency:** Streams video in chunks, avoiding high memory usage.
- **Browser Compatibility:** Supports modern browsers that handle the `Range` header.
- **Scalability:** Suitable for large video files and multiple users.

## Future Enhancements
- Support for multiple video formats
- Improved error handling and logging
- Adaptive bitrate streaming for varying network conditions

