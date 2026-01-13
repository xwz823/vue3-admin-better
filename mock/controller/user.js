const accessTokens = {
  admin: "admin-accessToken",
  editor: "editor-accessToken",
  test: "test-accessToken",
};

export default [
  {
    url: "/vab-mock-server/login",
    method: "post",
    response: (config) => {
      const { username } = config.body;
      const accessToken = accessTokens[username];
      if (!accessToken) {
        return {
          code: 500,
          msg: "帐户或密码不正确。",
        };
      }
      return {
        code: 200,
        msg: "success",
        data: { accessToken },
      };
    },
  },
  {
    url: "/vab-mock-server/register",
    method: "post",
    response: () => {
      return {
        code: 200,
        msg: "模拟注册成功",
      };
    },
  },
  {
    url: "/vab-mock-server/userInfo",
    method: "post",
    response: (config) => {
      const { accessToken } = config.body;
      let permissions = ["admin"];
      let username = "admin";
      if ("admin-accessToken" === accessToken) {
        permissions = ["admin"];
        username = "admin";
      }
      if ("editor-accessToken" === accessToken) {
        permissions = ["editor"];
        username = "editor";
      }
      if ("test-accessToken" === accessToken) {
        permissions = ["admin", "editor"];
        username = "test";
      }
      return {
        code: 200,
        msg: "success",
        data: {
          permissions,
          username,
          "avatar|1": [
            "https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_1.png",
            "https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_2.png",
            "https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_3.png",
            "https://gcore.jsdelivr.net/gh/zxwk1998/image/avatar/avatar_4.png",
          ],
        },
      };
    },
  },
  {
    url: "/vab-mock-server/logout",
    method: "post",
    response: () => {
      return {
        code: 200,
        msg: "success",
      };
    },
  },
];
