import axios from "axios";
import authHeader from "./AuthHeader";
import url from "./url";

const server = axios.create({
  baseURL: url.url,
});

export default {
  fetchStage() {
    return server.get("stage", {
      headers: authHeader(),
    })
  }
};

