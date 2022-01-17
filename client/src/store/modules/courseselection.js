/* eslint-disable no-unused-vars */
import CourseSelectionService from "@/services/CourseSelectionService.js";

export const namespaced = true;

export const state = {
  courseSelections: [],
  courseSelection: {},
  pending: false,
};
export const mutations = {
  SET_COURSESELECTIONS(state, courseSelections) {
    state.courseSelections = courseSelections;
  },
  SET_COURSESELECTION(state, courseSelection) {
    state.courseSelection = courseSelection;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async fetchCourseSelections({ commit }) {
    try {
      console.log("fetching studyplans");
      commit("SET_PENDING", true);
      const response = await CourseSelectionService.fetchCourseSelections();
      const courseSelections = response.data;
      commit("SET_COURSESELECTIONS", courseSelections);
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "There was a problem fetching courseSelections: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchCourseSelection({ commit, dispatch, getters }, { userId }) {
    try {
      //console.log(userId);
      commit("SET_PENDING", true);
      var courseSelection = getters.getCourseSelectionByUserId(userId);
      //console.log(courseSelection);
      if (courseSelection) {
        commit("SET_COURSESELECTION", courseSelection);
      } else {
        const response = await CourseSelectionService.fetchCourseSelection(
          userId
        );
        const courseSelection = response.data;
        console.log(courseSelection);
        //console.log(state.courseSelection);
        commit("SET_COURSESELECTION", courseSelection);
        //console.log(state.courseSelection);
      }
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "There was a problem fetching a courseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async createCourseSelection(
    { state, commit, rootState, dispatch },
    { userId }
  ) {
    console.log("test");
    console.log(rootState);

    try {
      commit("SET_PENDING", true);
      state.courseSelection = {
        testNumber: 55,
      };
      state.courseSelection.testNumber = 55;
      const response = await CourseSelectionService.createCourseSelection(
        state.courseSelection
      );
      const courseSelection = response.data;
      //console.log(courseSelection);
      commit("SET_COURSESELECTION", courseSelection);
      state.courseSelection.semesterPlans = [
        {
          unbookedCourses: [],
          bookedCourses: [],
        },
      ];
      await dispatch("resetCoursePriority2", {});
      console.log(state.courseSelection);
      const userResponse = await CourseSelectionService.saveToUser(
        state.courseSelection,
        userId
      );
      const user = userResponse.data;
      rootState.user.user = user;
      await dispatch("user/updateUser", {}, { root: true });
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "There was a problem creating a courseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async deleteCourseSelection({ state, commit, rootState, dispatch }) {
    try {
      commit("SET_PENDING", true);
      await CourseSelectionService.deleteCourseSelection(state.courseSelection);
      const courseSelection = undefined;
      commit("SET_COURSESELECTION", courseSelection);
      rootState.user.user.courseSelection = courseSelection;

      await dispatch("user/updateUser", {}, { root: true });
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "There was a problem deleting a CourseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },

  async updateCourseSelection({ state, commit }) {
    try {
      commit("SET_PENDING", true);
      const response = await CourseSelectionService.updateCourseSelection(
        state.courseSelection
      );
      const courseSelection = response.data;
      commit("SET_COURSESELECTION", courseSelection);
    } catch (error) {
      const notification = {
        type: "error",
        message:
          "There was a problem updating a courseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },

  async fillEmptyCourseSelectionWithCourses({ state, rootGetters, dispatch }) {
    let helperArrayForSemesterPlans = [];
    const officialCoursesInSemester = await dispatch(
      "program/getModalCourses",
      {},
      { root: true }
    );
    console.log(officialCoursesInSemester);
    let unbookedCoursesHelpArray = [];
    for (let course in officialCoursesInSemester[0]) {
      const courseCodes = [];
      unbookedCoursesHelpArray.push({
        code: officialCoursesInSemester[0][course].code,
        name: officialCoursesInSemester[0][course].name,
        ects: officialCoursesInSemester[0][course].ects,
      });

      //unbookedCoursesHelpArray.push(obj);
    }
    state.courseSelection.semesterPlans = [
      {
        unbookedCourses: unbookedCoursesHelpArray,
        bookedCourses: [],
      },
    ];
    console.log("filled courses");
    console.log(state.courseSelection);
    //  state.CourseSelection.semesterPlans[0] = helperArrayForSemesterPlans;
    //rootGetters["semester/getSemesters"],
    //  helperArrayForSemesterPlans,
    //  startOfStudy
    //  );

    await dispatch("updateCourseSelection");
  },

  async moveCourse(
    { dispatch },
    { fromCourseIndex, toCourseIndex, fromCoursePriority, toCoursePriority }
  ) {
    const unbookedCourses =
      state.courseSelection.semesterPlans[0].unbookedCourses;
    const bookedCourses = state.courseSelection.semesterPlans[0].bookedCourses;
    state.courseSelection.testNumber = 1;
    console.log({ fromCoursePriority, toCoursePriority });

    // if(toCoursePriority < 99) return;
    var courseToMove = undefined;
    if (fromCoursePriority > 0)
      courseToMove = bookedCourses[fromCoursePriority - 1];
    else courseToMove = unbookedCourses.splice(fromCourseIndex, 1)[0];
    if (courseToMove.ects == 0) return;
    if (toCoursePriority > 0) {
      if (
        bookedCourses[toCoursePriority - 1] != undefined ||
        bookedCourses[toCoursePriority - 1].name != ""
      ) {
        var swapper = bookedCourses[toCoursePriority - 1];
        swapper.priority = fromCoursePriority;
        if (fromCoursePriority > 0)
          bookedCourses[fromCoursePriority - 1] = swapper;
        else if (swapper.ects != 0) unbookedCourses.push(swapper);
      }
      courseToMove.priority = toCoursePriority;
      bookedCourses[toCoursePriority - 1] = courseToMove;
    } else {
      unbookedCourses.splice(toCourseIndex, 0, courseToMove);
      if (fromCoursePriority > 0) {
        console.log("from course prio:" + fromCoursePriority);
        bookedCourses[fromCoursePriority - 1] = {
          code: "",
          name: "",
          ects: 0,
          priority: courseToMove.priority,
        };
      }
    }
    console.table(state.courseSelection.semesterPlans[0].bookedCourses);
    await dispatch("updateCourseSelection");
  },
  async addCoursePriority({ dispatch }) {
    state.courseSelection.testNumber++;
    var test = state.courseSelection.semesterPlans[0].bookedCourses[0];
    state.courseSelection.semesterPlans[0].bookedCourses.push({
      code: "",
      name: "",
      ects: 0,
      priority: state.courseSelection.semesterPlans[0].bookedCourses.length + 1,
    });
    await dispatch("updateCourseSelection");
    //state.courseSelection.semesterPlans[0].bookedCourses = [];
  },
  async deleteCoursePriority({ dispatch }, { priority }) {
    const bookedCourses = state.courseSelection.semesterPlans[0].bookedCourses;
    for (let i = priority; i < bookedCourses.length; i++) {
      bookedCourses[i].priority--;
    }
    var course = bookedCourses.splice(priority - 1, 1)[0];
    if (course.ects != 0)
      state.courseSelection.semesterPlans[0].unbookedCourses.push(course);
    await dispatch("updateCourseSelection");
  },
  async resetCoursePriority2({ state, dispatch, rootGetters }) {
    var test = [];
    const currSemester = rootGetters["semester/getCurrentSemester"];
    const coursesInThisSemester = rootGetters["modalcourse/getCourses"].filter(
      (course) => course.semester.name == currSemester.name
    );
    state.courseSelection.semesterPlans[0].semester;
    coursesInThisSemester.forEach((modalCourse) => {
      test.push({
        code: modalCourse.code,
        ects: 5,
        name: modalCourse.name,
      });
    });
    state.courseSelection.semesterPlans[0].unbookedCourses = test;
    state.courseSelection.semesterPlans[0].bookedCourses = [];
    // console.log(state.courseSelection);
    await dispatch("updateCourseSelection");
    //console.log(test);
  },
  async resetCoursePriority({ state, dispatch, rootGetters }) {
    state.courseSelection.semesterPlans[0].semester =
      rootGetters["semester/getCurrentSemester"];
    state.courseSelection.semesterPlans[0].unbookedCourses = [
      {
        code: "GT1",
        ects: 5,
        name: "AI for Games",
      },
      {
        code: "GTAT1",
        ects: 5,
        name: "Game Technology & Interactive Systems - Aktuelle Themen 1",
      },
      {
        code: "VC1",
        ects: 5,
        name: "Bild- und Videokompression",
      },
      {
        code: "VCAT1",
        ects: 5,
        name: "Visual Computing - Aktuelle Themen 1",
      },
      {
        code: "WT1",
        ects: 5,
        name: "DevOps",
      },
      {
        code: "WT1",
        ects: 5,
        name: "Web Technology - Aktuelle Themen 1",
      },
      {
        code: "GT2",
        ects: 5,
        name: "Game  Engines",
      },
      {
        code: "GTAT2",
        ects: 5,
        name: "Game Technology & Interactive Systems - Aktuelle Themen 2",
      },
      {
        code: "VC2",
        ects: 5,
        name: "Bildanalyse",
      },
      {
        code: "VCAT2",
        ects: 5,
        name: "Visual Computing - Aktuelle Themen 2",
      },
      {
        code: "WT2",
        ects: 5,
        name: "Usability",
      },
      {
        code: "WT2",
        ects: 5,
        name: "Web Technology - Aktuelle Themen 2",
      },
    ];
    state.courseSelection.semesterPlans[0].bookedCourses = [];
    console.log(state.courseSelection);
    await dispatch("updateCourseSelection");
  },
};

export const getters = {
  getCourseSelection: (state) => {
    return state.courseSelections[0];
  },
  getCourseSelectionByUserId: (state) => (userId) => {
    return state.courseSelections.find(
      (courseSelection) => courseSelection.userId === userId
    );
  },
  getSemesterPlan: (state) => {
    return state.courseSelection.semesterPlans[0];
  },
  getSemesterPlans: (state) => {
    return state.courseSelection.semesterPlans[0];
  },
  getCourseByPriority: (state) => (priority) => {
    return state.courseSelection.semesterPlans[0].bookedCourses.find(
      (course) => course.priority === priority
    );
  },
};
