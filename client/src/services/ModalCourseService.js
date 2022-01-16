import axios from "axios";
import authHeader from "./AuthHeader";
import url from "./url";

const server = axios.create({
  baseURL: url.url,
});

export default {
  fetchModalCourses() {
    return server.get("modalcourse", {
      headers: authHeader(),
    });
  },
  fetchModalCourse(semesterId) {
    return server.get(`modalcourse/${semesterId}`);
  },
  updateModalCourse(code, reason, semester) {
    return server.put("modalcourse/updatesurvey",{code, reason, semester}, {
      headers: authHeader(),
    });
  },
  updateModalCourses(semester) {
    return server.put(`modalcourse/${semester._id}`, semester, {
      headers: authHeader(),
    });
  },
  createModalCourse(modalCourse) {
    return server.post("modalcourse/create", modalCourse, {
      headers: authHeader(),
    });
  },
  deleteModalCourse(modalCourse) {
    return server.delete(
      `modalcourse/${modalCourse._id}`,
      {
        headers: authHeader(),
      },
      { modalCourse }
    );
  },
};
