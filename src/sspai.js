// const express = require("express");
// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const Crawler = require("simplecrawler");
const fs = require("fs");

// 创建一个爬虫实例，并设置起始URL
const crawler = new Crawler("https://sspai.com/api/v1/search/article/page/get");

function addURLToCrawlerWithParams(url, params) {
  const urlObj = new URL(url);
  for (const key in params) {
    urlObj.searchParams.set(key, params[key]);
  }

  crawler.queueURL(urlObj.toString());
}

const list = ["浏览器", "笔记本", "汽车"];

// 示例：动态添加参数并加入队列
for (let i = 0; i < 3; i++) {
  const title = list[i];
  addURLToCrawlerWithParams("https://sspai.com/api/v1/search/article/page/get", {
    free: "1",
    title,
    stime: "1681180820", // 一年以内
    offset: i,
    limit: "8",
  });
}

crawler.interval = 1000 * 3; // 请求的间隔时间（毫秒）
crawler.maxDepth = 1; // 爬取的最大深度

// 为“fetchcomplete”事件添加一个监听器，以便在抓取到页面时处理响应
crawler.on("fetchcomplete", function (queueItem, responseBuffer, response) {
  console.log({ queueItem });
  const { path } = queueItem;
  // 获取path链接中的offset参数
  const offset = path.match(/offset=(\d+)/)?.[1] || -1;
  console.log({ offset });
  // 可以在这里处理 responseBuffer
  const bodyString = responseBuffer.toString("utf-8"); // 将Buffer转换为字符串
  const jsonData = JSON.parse(bodyString); // 将字符串解析为JSON对象

  // 现在你可以使用jsonData来访问JSON数据
  const formatdata = jsonData.data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      banner: item.banner,
      summary: item.summary,
      // 时间戳转为日期
      released_time: new Date(item.released_time * 1000).toLocaleDateString(),
    };
  });
  if (formatdata.length) {
    // 将 jsonData 存储到文件data.json中

    fs.writeFileSync(`data/sspai-${offset}.json`, JSON.stringify(formatdata, null, 2));
  }
});

// 出现爬虫错误时的处理
crawler.on("fetcherror", function (queueItem, response) {
  console.error(`Fetch error encountered: ${queueItem.url}`);
});

// 开始爬取
crawler.start();
