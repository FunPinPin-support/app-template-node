/**
 React 客户端请求
 */

import { IS_EMBEDDED_APP } from "config";
import { Redirect } from "fpp-app-bridge/dist/actions";

// 由于内嵌，校验返回来的header是否有x-fpp-api-request-failure-reauthorize， 如果有，重定向到授权
export function validFetchResHeader(app, response) {
  if (IS_EMBEDDED_APP) {
    if (response.headers.get("x-fpp-api-request-failure-reauthorize") === "1") {
      const authUrlHeader = response.headers.get(
        "x-fpp-api-request-failure-reauthorize-url"
      );
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }
  }
}

 /**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
export function obj2String(obj, arr = [], idx = 0) {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]];
  }
  return new URLSearchParams(arr).toString();
}

 interface IRequestParam {
   url: string;
   data?: any;
   headers?: any;
   app?: any;
 }

 // 上传图片到CDN
 export const postUpload = async (data, headers, app) => {
   const res = await fetch("/admin/file/media/upload", {
     method: "post",
     headers: {
       "Content-Type": "multipart/form-data;charset=UTF-8",
       ...headers,
     },
     body: data,
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 // 产品导入
 export const postImportProducts = async (data, headers, app) => {
   const res = await fetch(`/admin/file/csv/import-product`, {
     method: "POST",
     headers: {
       "Content-Type": "multipart/form-data;charset=UTF-8",
       ...headers,
     },
     body: data,
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 // 产品导出 (勾选)
 export const postExportProductsByIds = async (data, headers, app) => {
   const res = await fetch(`/admin/file/csv/bulk-by-ids`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       ...headers,
     },
     body: data,
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 // 产品导出 (条件)
 export const postExportProductsBySearch = async (data, headers, app) => {
   const res = await fetch(`/admin/file/csv/bulk-by-search`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       ...headers,
     },
     body: data,
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 // 产品评论导入
 export const postImportProductsReviews = async (data, headers, app) => {
   const res = await fetch(`/import`, {
     method: "POST",
     headers: {
       // "Content-Type": "multipart/form-data;charset=UTF-8",
       ...headers,
     },
     body: data,
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 export const post = async ({ url, data, headers, app }: IRequestParam) => {
   const res = await fetch(url, {
     method: "POST",
     headers: {
       "Content-Type": "application/json; charset=UTF-8",
       ...headers,
     },
     body: JSON.stringify(data),
   });
   validFetchResHeader(app, res);
   return await res.json();
 };
 export const put = async ({ url, data, headers, app }: IRequestParam) => {
   const res = await fetch(url, {
     method: "PUT",
     headers: {
       "Content-Type": "application/json; charset=UTF-8",
       ...headers,
     },
     body: JSON.stringify(data),
   });
   validFetchResHeader(app, res);
   return await res.json();
 };
 export const del = async ({ url, data, headers, app }: IRequestParam) => {
   const res = await fetch(url,{
     method: "DELETE",
     headers: {
       "Content-Type": "application/json; charset=UTF-8",
       ...headers
     },
     body: JSON.stringify(data),
   });
   validFetchResHeader(app, res);
   return await res.json();
 };

 export const get = async ({ url, data, headers, app }: IRequestParam) => {
   let queryString = ""
   if(data && JSON.stringify(data) !== "{}") {
     queryString = obj2String(data);
   }
   let finalUrl = queryString ? `${url}?${queryString}`: url;
   const res = await fetch(finalUrl, {
     method: "GET",
     headers: {
       "Content-Type": "application/json; charset=UTF-8",
       ...headers,
     },
   });
   validFetchResHeader(app, res);
   return await res.json();
 };
