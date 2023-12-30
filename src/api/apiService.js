import request from "./request";
import { ENDPOINTS } from "./apiRoutes";

function get(url, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "GET",
      crossDomain: true,
    },
    isTokenNeeded
  );
}

function post(url, body, isTokenNeeded = true, customHeaders) {
  return request(
    {
      url,
      method: "POST",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded,
    customHeaders
  );
}

function uploadFile(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "POST",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded,
    {
      "Content-Type": "multipart/form-data",
    }
  );
}

function put(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "PUT",
      data: body,
    },
    isTokenNeeded
  );
}

function deleteResource(url,body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "DELETE",
      data:body,
      crossDomain: true,
    },
    isTokenNeeded
  );
}

function patch(url, body, isTokenNeeded = true, customHeaders) {
  return request(
    {
      url,
      method: "PATCH",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded,
    customHeaders
  );
}

const API = {
  get,
  post,
  put,
  patch,
  deleteResource,
  uploadFile,
};

export { API, ENDPOINTS };
