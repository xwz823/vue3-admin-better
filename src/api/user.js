import { tokenName } from "@/config";
import request from "@/utils/request";

export async function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data
  });
}

export function getUserInfo(accessToken) {
  return request({
    url: "/userInfo",
    method: "post",
    data: {
      [tokenName]: accessToken,
    },
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

export function register() {
  return request({
    url: "/register",
    method: "post",
  });
}
