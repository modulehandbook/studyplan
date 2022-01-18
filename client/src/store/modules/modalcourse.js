import ModalCourseService from "@/services/ModalCourseService.js";

export const namespaced = true;

export const state = {
  modalCourses: [],
  modalCourse: {},
};

export const mutations = {
  SET_MODALCOURSES(state, modalCourses) {
    state.modalCourses = modalCourses;
  },
  SET_MODALCOURSE(state, modalCourse) {
    state.modalCourse = modalCourse;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async createCourse(
    { state, commit, dispatch },
    { courseName, code, availablePlaces, semester }
  ) {
    try {
      commit("SET_PENDING", true);
      state.modalCourse = {
        name: courseName,
        code: code,
        availablePlaces: availablePlaces,
        semester: semester,
      };
      const response = await ModalCourseService.createModalCourse(
        state.modalCourse
      );
      const modalCourse = response.data;
      //const test = await ModalCourseService.updateModalCourse(modalCourse);
      let modalCourses = state.modalCourses;
      modalCourses.push(modalCourse);
      commit("SET_MODALCOURSES", modalCourses);
      //state.modalCourses.push(test.data);
      console.log("the state assumes this value");
      console.log(state.modalCourses);
      await dispatch("fetchCourses");
    } catch (error) {
      const notification = {
        type: "error",
        message: "there was a problem creating modal course" + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchCourse({ state, commit }, { semester, code }) {
    //ask for the semester route -> if there is a 404, so no semester info is there yet,
    // check the basic vuex course state
    try {
      commit("SET_PENDING", true);
      // console.log(state.modalCourses);
      const foundModalCourse = state.modalCourses.find(
        (modalCourse) =>
          modalCourse.semester.name == semester && modalCourse.code == code
      );

      commit("SET_MODALCOURSE", foundModalCourse);
      console.log("found the following course:");
      console.log(state.modalCourse);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchCourses({ commit }) {
    try {
      commit("SET_PENDING", true);
      await ModalCourseService.fetchModalCourses()
        .then((response) => {
          commit("SET_MODALCOURSES", response.data);
          console.log(state.modalCourses);
        })
        .catch(async (error) => {
          const notification = {
            type: "error",
            message: "There was a problem fetching courses" + error.message,
          };
          console.log(notification);
        });
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async deleteCourse({ state, commit }, { index }) {
    try {
      commit("SET_PENDING", true);
      const courseToDelete = state.modalCourses.splice(index, 1)[0];

      await ModalCourseService.deleteModalCourse(courseToDelete);
      commit("SET_MODALCOURSES", state.modalCourses);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async updateSelectionReasons(
    { state, commit, rootGetters },
    { mappedCourses }
  ) {
    console.log("teste");
    try {
      const semester = rootGetters["semester/getCurrentSemester"];
      //const course = mappedCourses[0];
      mappedCourses.forEach(async (mappedCourse) => {
        await ModalCourseService.updateModalCourse(
          mappedCourse.code,
          mappedCourse.selectionReason,
          semester._id
        ).then((response) => {
          console.log(response.data);
          const changedCourse = response.data;
          state.modalCourses.forEach((modalCourse, i) => {
            if (modalCourse.code == changedCourse.code)
              state.modalCourses[i].reasonsForSelection =
                changedCourse.reasonsForSelection;
          });
        });
      });
      console.log(state.modalCourses);
      commit("SET_MODALCOURSES", state.modalCourses);
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "there was a problem updating the reasons modal courses where chosen: " +
          error.message,
      };
      console.log(notification);
    }
  },
  async assignUsers({ commit, rootGetters, getters }) {
    try {
      commit("SET_PENDING", true);
      const semester = rootGetters["semester/getCurrentSemester"];
      const test = getters.getCoursesBySemester(semester);
      console.log(test);
      //if(semester != undefined) return;
      const response = await ModalCourseService.updateModalCourses(semester);
      const modalCourses = response.data;
      console.log("the following courses from the databese could be found:");
      console.log(modalCourses);
      //commit("SET_MODALCOURSES", modalCourses);
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "there was a problem assigning users to modal courses: " +
          error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async removeUserfromCourses({commit, rootGetters, dispatch}, {coursesToRemoveUserFrom, user}){
    try{
      commit("SET_PENDING", true);
      const semester = rootGetters["semester/getCurrentSemester"];
     // let responses = [];
      console.log(coursesToRemoveUserFrom);
      coursesToRemoveUserFrom.forEach(async (courseToRemoveFrom) => {
        const response = await ModalCourseService.removeUserFromCourse(user, semester, courseToRemoveFrom.code);
        //const index = state.modalCourses.findIndex((course) => course.code === response.data.code && course.semester._id === response.data.semester._id);
       // if(index != -1)state.modalCourses.splice(index, 1, response.data);
       console.log(response.data);
      });
      await dispatch("fetchCourses");
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "there was a problem assigning users to modal courses: " +
          error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
};

export const getters = {
  getCourses: (state) => {
    return state.modalCourses;
  },
  getCourseByCode: (state) => (code) => {
    if (!state.courses) return;
    return state.courses.find((course) => course.course.code === code);
  },
  getCoursesBySemester: (state) => (semester) => {
    if (!state.modalCourses) return;
    return state.modalCourses.filter(
      (modalCourse) => modalCourse.semester.name === semester.name
    );
  },
  getCoursesByUser: (state) => (user) => {
    let returnArray = [];
    state.modalCourses.forEach((course) => {
      course.students.forEach((student) => {
        if(student._id === user) returnArray.push(course);
      });
    });
    return returnArray;
  },
};
