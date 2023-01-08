const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //   Lista de palabras para buscar
  const wordsInsert = ["hello", "arise", "broke"];

  for (let i = 0; i < wordsInsert.length; i++) {
    await page.goto("https://www.wordreference.com/");

    // Type into search box.
    await page.type(".ac-input", `${wordsInsert[i]}`);
    await page.click(".submit-button");
    await page.waitForSelector(".headerWord");

    const wordsAll = await page.evaluate(() => {
      const words = [];
      const wordHTML = document.querySelector(".headerWord").innerHTML;

      words.push({
        word: wordHTML,
      });
      return words;
    });
    console.log(wordsAll);
  }

  //   await browser.close();
})();
