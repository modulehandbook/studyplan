import axios from "axios";
import authHeader from "./AuthHeader";
import url from "./url";

const server = axios.create({
  baseURL: url.url,
});

export default {
  fetchCourseSelections() {
    return server.get("courseselection");
  },
  fetchCourseSelection(userId) {
    return server.get(`courseselection/${userId}`, { headers: authHeader() });
  },
  updateCourseSelection(courseSelection) {
    return server.put(
      `courseselection/${courseSelection._id}`,
      courseSelection,
      {
        headers: authHeader(),
      }
    );
  },
  createCourseSelection(courseSelection) {
    return server.post(`courseselection/create`, courseSelection, {
      headers: authHeader(),
    });
  },
  deleteCourseSelection(courseSelection) {
    return server.delete(
      `courseselection/${courseSelection._id}`,
      {
        headers: authHeader(),
      },
      { courseSelection }
    );
  },
  saveToUser(courseSelection, userId) {
    return server.post(
      `courseselection/save`,
      { courseSelection, userId },
      {
        headers: authHeader(),
      }
    );
  },
};
