const fs = require("fs");
const axios = require("axios");

async function getZhihuHotList() {
  const hotList = {};
  let num = 1;
  const response = await axios.get("https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total");
  const data = response.data.data;
  data.forEach((ele) => {
    hotList[num] = {
      title: ele.target.title,
      link: ele.target.url.replace("api", "www").replace("questions", "question"), //将 URL 替换为正确可访问的地址
    };
    num++;
  });
  fs.writeFileSync(`data/zhihu.json`, JSON.stringify(hotList, null, 2));
}

getZhihuHotList();
