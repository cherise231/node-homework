const fs = require("fs");
const path = require("path");

// Write a sample file for demonstration

const filePath = path.join(__dirname, "sample-files/sample.txt");
// 1. Callback style

fs.writeFileSync(filePath, "Hello, async world!");
fs.readFile(filePath, "utf-8", (err, content) => {
  if (err) {
    console.log("File read failed:", err.message);
    return;
  }
  console.log("Callback:", content);
});
// console.log('last statement');

// Callback hell example (test and leave it in comments):
// fs.writeFileSync('sample-files/sample.txt', 'Hello, async world!');
// fs.readFile('sample-files/sample.txt', 'utf-8', (err, content) => {
//   if (err) {
//     console.log('File read failed:', err.message);
//     return;
//   }

// fs.readFile('sample-files/sample.txt', 'utf-8', (err2, content2) => {
//   if (err2) {
//     console.log('File read failed again:', err2.message);
//     return;
//   }

//   console.log('First read:', content);
//   console.log('Nested read:', content2);

//   });
// });

// 2. Promise style
fs.promises
  .readFile(filePath, "utf-8")
  .then((content) => {
    console.log("Promise:", content);
  })
  .catch((err) => {
    console.log(err.message);
  });

// 3. Async/Await style
async function readFileFunc() {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    console.log("Async/Await:", content);
  } catch (err) {
    console.log("File read failed:", err.message);
  }
}

readFileFunc();
