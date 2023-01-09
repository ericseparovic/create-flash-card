const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //   Lista de palabras para buscar
  const wordsInsert = ["hello", "arise", "broke", "dsxs"];
  const wordsDictionary = [];

  for (let i = 0; i < wordsInsert.length; i++) {
    await page.goto("https://www.wordreference.com/");

    await page.type(".ac-input", `${wordsInsert[i]}`);
    await page.click(".submit-button");

    await page.waitForSelector(".headerWord");
    await page.waitForSelector(".even");
    await page.waitForSelector(".ToWrd");

    console.log(await page.waitForSelector(".ToWrd"));

    const wordsAll = await page.evaluate(() => {
      const wordHTML = document.querySelector(".headerWord").innerText;
      const meaning =
        document.querySelector(".even .ToWrd").firstChild.nodeValue;
      const example = document.querySelector(".even .FrEx").innerText;

      return {
        word: wordHTML,
        meaning: meaning,
        example: example,
      };
    });

    wordsDictionary.push(wordsAll);
  }

  console.log(wordsDictionary);

  // await browser.close();
})();
