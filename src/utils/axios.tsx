/* eslint-disable @typescript-eslint/no-explicit-any */
import * as axios from "axios";
import { BASE_URL } from "./constants";
// import APIService from "../services/api-service";
// import decodeJWT from "./decrypt-payload";

// const getHeaderKey = async () => {

//   const response1 = await APIService.getToken({ call_type: 'get_key' });
//   console.log("API RESPONSE FROM GET TOKEN =>>> ", response1.data);

//   const { payload: { token, key } } = decodeJWT(response1.data.data);

//   const payload: any = { call_type: "encode_key", token, key };

//   payload.timestamp = Math.floor(Date.now() / 1000);

//   const response2 = await APIService.encodeKey(payload);
//   console.log("API RESPONSE FROM ENCODE KEY =>>>", response2.data);

//   const { payload: { header_key } } = decodeJWT(response2.data.data);

//   return header_key;
// };

export const axiosInstanceWithoutKey = axios.default?.create({
  baseURL: BASE_URL + "/lib",
  headers: {
    Accept: "text/html, application/xhtml+xml",
    "Content-Type": "multipart/form-data",
    platform: "web",
  },
});

const axiosInstance = axios.default?.create({
  baseURL: BASE_URL + "/lib",
  headers: {
    Accept: "text/html, application/xhtml+xml",
    "Content-Type": "multipart/form-data",
    platform: "web",
  },
});

// axiosInstance.interceptors.request.use(async (req: any) => {
//   try {
//     const headerKey = await getHeaderKey();
//     // if (headerKey) {
//     req.headers.set("header-key", headerKey);
//     // }
//     return req;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// });

export default axiosInstance;
