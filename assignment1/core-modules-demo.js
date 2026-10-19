const os = require("os");
const path = require("path");
const fs = require("fs");

const sampleFilesDir = path.join(__dirname, "sample-files");
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// OS module
console.log("Platform:", os.platform());
console.log("CPU:", os.cpus());
console.log("Total Memory:", os.totalmem());
// Path module
console.log("Joined path:", path.join(__dirname, "sample-files/demo.txt"));

// fs.promises API
const filePathDemo = path.join(__dirname, "sample-files/demo.txt");

async function runPromisesDemo() {
  try {
    await fs.promises.writeFile(filePathDemo, "Hello from fs.promises!");
    const contentFile = await fs.promises.readFile(filePathDemo, "utf-8");
    console.log("fs.promises read:", contentFile);
  } catch (error) {
    console.log("Error reading file:", error.message);
  }
}
runPromisesDemo();

// Streams for large files- log first 40 chars of each chunk

const filePathStreams = path.join(__dirname, "sample-files/largefile.txt");

async function runStreams() {
  try {
    const lines = [];
    for (let i = 0; i < 100; i++) {
      lines.push(`This is line ${i + 1} in a large file...`);
    }
    await fs.promises.writeFile(filePathStreams, lines.join("\n"));
    const contentFileStream = fs.createReadStream(filePathStreams, {
      encoding: "utf-8",
      highWaterMark: 1024,
    });
    for await (const chunk of contentFileStream)
      console.log("Read chunk:", chunk.slice(0, 40));
    console.log("Finished reading large file with streams.");
  } catch (error) {
    console.log("Error reading file:", error.message);
  }
}
runStreams();
