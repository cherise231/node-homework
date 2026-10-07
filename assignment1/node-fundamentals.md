# Node.js Fundamentals

## What is Node.js?

Answer here..

## How does Node.js differ from running JavaScript in the browser?

Node.js allows developers to run JavaScript outside of the browser. It gives JavaScript the ability to do things like read and write files, access environment variables, and work with APIs.

## What is the V8 engine, and how does Node use it?

The V8 engine is what Node uses to execute JavaScript code. It is designed to run JavaScript efficiently and uses compilation techniques to make the code run quickly. Node uses the V8 engine to run Javascript outside the browser.

## What are some key use cases for Node.js?

Some key use cases for Node.js are building web servers and APIs for websites and applications, creating command-line tools that can automate tasks, and building real-time applications such as chat apps or live dashboards that push updates to users. Node.js can also be used to create build tools and scripts that bundle code, process files, and automate development tasks.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**

```js
CommonJS uses 'require()' to load code from another file or package and module.exports to export code for other files to use.
ex.
const { register, logoff } = require("../controllers/userController");
```

**ES Modules (supported in modern Node.js):**

```js
ES Modules use import and export to share code between files or packages. For example, in React I have used 'import { useState, useEffect } from "react"' to bring code from the React package into my file. We can also import code from another file, such as
import { something } from "./file.js" .
import { useState, useEffect } from "react";
```
