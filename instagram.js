const puppeteer = require("puppeteer");

const BASE_URL = "https://instagram.com/";
const TAG_URL = tag => `https://instagram.com/explore/tags/${tag}`;
const PERSON_URL = person => `https://instagram.com/${person}`;

const instagram = {
  browser: null,
  page: null,

  initialize: async () => {
    instagram.browser = await puppeteer.launch({
      headless: false,
      args: ["--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });

    instagram.page = await instagram.browser.newPage();
  },

  login: async (username, password) => {
    await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });

    let loginButton = await instagram.page.$x(
      '//a[contains(text(), "Log in")]'
    );

    /**
     * Click on the login url button
     */
    await loginButton[0].click();

    // await instagram.page.waitForNavigation({ waitUntil: "networkidle2" });

    await instagram.page.waitFor(1000);

    /**
     * Writing the username and password
     */
    await instagram.page.type('input[name="username"]', username, {
      delay: 50
    });
    await instagram.page.type('input[name="password"]', password, {
      delay: 50
    });

    /**
     * Clicking on the login button
     */
    loginButton = await instagram.page.$x(
      '//button[contains(@type, "submit")]'
    );

    await loginButton[0].click();

    await instagram.page.waitFor(10000);
    await instagram.page.waitFor('a > span[aria-label="Profile"]');
  },
  likePost: async (posts, limit) => {
    for (let i = 0; i < limit; i++) {
      let post = posts[i];

      /**
       * Click on the post
       */
      await post.click();

      /**
       * Wait for the motal to appear
       */

      await instagram.page.waitFor('span[id="react-root"][aria-hidden="true"]');
      await instagram.page.waitFor(1000);

      let isLikable = await instagram.page.$('span[aria-label="Like"]');

      if (isLikable) {
        await instagram.page.click('span[aria-label="Like"]');
      }

      await instagram.page.waitFor(3000);

      /**
       * Close the modal
       */
      let closeModalButton = await instagram.page.$x(
        '//button[contains(text(), "Close")]'
      );
      await closeModalButton[0].click();

      await instagram.page.waitFor(1000);

      if (!isLikable) break;
    }
  },
  likeTagsProcess: async (taygs = []) => {
    for (let tag of taygs) {
      /**
       * GO to the tag page
       */
      await instagram.page.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
      await instagram.page.waitFor(1000);

      let posts = await instagram.page.$$(
        'article > div:nth-child(3) img[decoding="auto"]'
      );

      await instagram.likePost(posts, 3);

      await instagram.page.waitFor(15000);
    }
  },
  likePeopleProcess: async (people = []) => {
    for (let person of people) {
      await instagram.page.goto(PERSON_URL(person), {
        waitUntil: "networkidle2"
      });
      await instagram.page.waitFor(1000);
      let posts = await instagram.page.$$('article > div img[decoding="auto"]');

      instagram.likePost(posts, posts.length);

      await instagram.page.waitFor(15000);
    }
  }
};

module.exports = instagram;
