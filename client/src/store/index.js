import { createStore } from "vuex";
import * as program from "@/store/modules/program.js";
import * as studyplan from "@/store/modules/studyplan.js";
import * as courseselection from "@/store/modules/courseselection.js";
import * as course from "@/store/modules/course.js";
import * as semester from "@/store/modules/semester.js";
import * as user from "@/store/modules/user.js";
import * as modalcourse from "@/store/modules/modalcourse";
export const store = createStore({
  modules: {
    program,
    studyplan,
    courseselection,
    course,
    modalcourse,
    semester,
    user,
  },
  mutations: {
    initialiseStore(state) {
      // Check if the ID exists
      if (localStorage.getItem("store")) {
        // Replace the state object with the stored item
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem("store")))
        );
      }
    },
  },
});
