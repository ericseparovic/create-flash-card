const puppeteer = require("puppeteer");
const fs = require("fs");
const prompts = require("prompts");
let words = "";

//Input of words
(async () => {
  const words = createArrayWords(
    "it worked, but it still stops execution when that timeout is done. how can I continue to execute the remaining code even though the timeout occurs"
  );

  findWords(words);
})();

//   Lista de palabras para buscar

async function findWords(wordsInput) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    for (let i = 0; i < wordsInput.length; i++) {
      await page.goto("https://www.wordreference.com/");

      await page.type(".ac-input", `${wordsInput[i]}`);
      await page.click(".submit-button");

      try {
        await page.waitForSelector(".headerWord", { timeout: 1000 });
        await page.waitForSelector(".even", { timeout: 1000 });

        const wordsAll = await getData(page);
        words += wordsAll;
      } catch (e) {
        console.log(e, wordsInput);
      }

      console.log(words);
    }

    // await browser.close();
  } catch (err) {
    console.log(err);
  }

  createTxt(words);
}

function createTxt(words) {
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
}

async function getData(page) {
  return await page.evaluate(() => {
    const word = document.querySelector(".headerWord").innerText;
    console.log(word);
    const meaning = document.querySelector(".even .ToWrd").firstChild.data;
    const exampleES = document.querySelector(".even .ToEx span i").innerHTML;
    const exampleUS = document.querySelector(".even .FrEx span").innerHTML;

    return `${word}; ${meaning}; ${exampleES}; ${exampleUS} \n`;
  });
}

function createArrayWords(text) {
  text = text.replaceAll(/\W/g, " ");
  text = text.replaceAll(/\d/g, " ");
  const wordsList = text.split(" ");
  const words = wordsList.filter((word) => {
    if (word) {
      return word;
    }
  });
  return words;
}
