const fs = require("fs");
let content = fs.readFileSync("src/offlineData.ts", "utf8");
content = content.split("totalOccurrences: Math.floor(Math.random() * 200 + 10),\\n    quranicOccurrences: [").join("totalOccurrences: 153,\n    quranicOccurrences: [");
fs.writeFileSync("src/offlineData.ts", content);
console.log("updated");
