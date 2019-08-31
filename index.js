const ig = require("./instagram");
require("dotenv").config();

(async () => {
  await ig.initialize();

  await ig.login(process.env.USER_NAME, process.env.PASSWORD);

  // await ig.likeTagsProcess(['cars', 'newyork']);
  await ig.likePeopleProcess(["kittysooyun"]);
})();
