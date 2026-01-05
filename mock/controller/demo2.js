const data = [
  {
    time: "04/14 18:37",
    status: "正式测定",
    location: "印尼爪哇岛",
    depth: "600",
    magnitude: "5.7",
    alertLevel: 3,
    color: "blue",
  },
  {
    time: "04/14 17:55",
    status: "深源",
    location: "印尼爪哇岛",
    depth: "",
    magnitude: "7.1",
    alertLevel: 3,
    color: "blue",
  },
  {
    time: "04/14 04:48",
    status: "",
    location: "新疆巴音郭楞州尉犁县",
    depth: "",
    magnitude: "3.6",
    alertLevel: 4,
    color: "green",
  },
  {
    time: "04/14 02:05",
    status: "",
    location: "新疆和田地区皮山县",
    depth: "",
    magnitude: "3.4",
    alertLevel: 4,
    color: "green",
  },
  {
    time: "04/13 23:54",
    status: "",
    location: "加拿大温哥华岛附近海域",
    depth: "",
    magnitude: "6.1",
    alertLevel: 8,
    color: "red",
  },
  {
    time: "04/10 11:31",
    status: "",
    location: "新疆阿克苏地区拜城县",
    depth: "",
    magnitude: "3.0",
    alertLevel: 3,
    color: "blue",
  },
  {
    time: "04/10 09:05",
    status: "",
    location: "俾斯麦海",
    depth: "",
    magnitude: "5.3",
    alertLevel: 7,
    color: "orange",
  },
  {
    time: "04/09 20:17",
    status: "",
    location: "尼科巴群岛",
    depth: "",
    magnitude: "5.6",
    alertLevel: 6,
    color: "yellow",
  },
  {
    time: "04/09 18:31",
    status: "",
    location: "尼科巴群岛",
    depth: "",
    magnitude: "5.5",
    alertLevel: 6,
    color: "yellow",
  },
];

module.exports = [
  {
    url: "/custom/demo2/locationList",
    type: "get",
    response() {
      return { code: 200, msg: "success", data: data };
    },
  },
  // {
  //   url: "/custom/demo2/weatherList",
  //   type: "get",
  //   response() {
  //     return { code: 200, msg: "success", data: weatherData };
  //   },
  // },
];

