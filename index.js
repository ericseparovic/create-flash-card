const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //   Lista de palabras para buscar
  const wordsInsert = ["hello", "arise", "broke", "array", "in"];

  let words = "";
  try {
    for (let i = 0; i < wordsInsert.length; i++) {
      await page.goto("https://www.wordreference.com/");

      await page.type(".ac-input", `${wordsInsert[i]}`);
      await page.click(".submit-button");

      await page.waitForSelector(".headerWord");
      await page.waitForSelector(".even .ToWrd");
      await page.waitForSelector(".even .FrEx");

      const wordsAll = await page.evaluate(() => {
        const word = document.querySelector(".headerWord").innerText;
        const meaning =
          document.querySelector(".even .ToWrd").firstChild.nodeValue;
        const example = document.querySelector(".even .FrEx").innerText;

        return `${word}; ${word}; ${meaning}; ${example} \n`;
      });

      words += wordsAll;
    }

    await browser.close();
  } catch (err) {
    console.log(err);
  }

  let promiseWriteFile = new Promise((resolve, reject) => {
    fs.writeFile("example.txt", words, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  promiseWriteFile
    .then(() => {
      console.log("ok");
    })
    .catch(() => {
      console.log("Error", error);
    });
})();
