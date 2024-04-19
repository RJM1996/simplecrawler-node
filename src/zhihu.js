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
  // 获取今日日期的格式化字符串
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  const todayStr = `${yyyy}-${mm}-${dd}`;

  fs.writeFileSync(`data/zhihu-${todayStr}.json`, JSON.stringify(hotList, null, 2));
}

getZhihuHotList();
