import express from "express";
import { createReadStream, statSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.get("/video", (req, res) => {
    const file = `${__dirname}/public/video.mp4`;
    const stat = statSync(file);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        return res.status(416).send("Requires Range header");
    }

    const chunkSize = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize - 1, fileSize - 1);

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const fileStream = createReadStream(file, { start, end });
    fileStream.pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
