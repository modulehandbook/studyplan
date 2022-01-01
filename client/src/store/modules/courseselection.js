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
        message: "There was a problem fetching courseSelections: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchCourseSelection({ commit, dispatch, getters }, { userId }) {
  console.log("trying to fetch course selection");
    try {
      console.log(userId);
      commit("SET_PENDING", true);
      var courseSelection = getters.getCourseSelection;
      console.log(courseSelection);
      if (courseSelection) {
        commit("SET_COURSESELECTION", courseSelection);
      } else {
        const response = await CourseSelectionService.fetchCourseSelection(userId);
        const courseSelection = response.data;
        console.log(courseSelection);
          console.log(state.courseSelection);
        commit("SET_COURSESELECTION", courseSelection);
          console.log(state.courseSelection);


      }
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem fetching a courseSelection: " + error.message,
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
      const response = await CourseSelectionService.createCourseSelection(state.courseSelection);
      const courseSelection = response.data;
      console.log(courseSelection);
      commit("SET_COURSESELECTION", courseSelection);
      await dispatch("fillEmptyCourseSelectionWithCourses", {  });
    //  console.log(state.courseSelection)
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
        message: "There was a problem creating a courseSelection: " + error.message,
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
        message: "There was a problem deleting a CourseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },

  async updateCourseSelection({ state, commit }) {
    try {
      commit("SET_PENDING", true);
      const response = await CourseSelectionService.updateCourseSelection(state.courseSelection);
      const courseSelection = response.data;
      commit("SET_COURSESELECTION", courseSelection);
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem updating a courseSelection: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },

  async fillEmptyCourseSelectionWithCourses(
    { state, rootGetters, dispatch }

  ) {
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
    state.courseSelection.semesterPlans = [{
      unbookedCourses: unbookedCoursesHelpArray,
      bookedCourses: [],
    }];
    console.log("filled courses")
    console.log(state.courseSelection);
  //  state.CourseSelection.semesterPlans[0] = helperArrayForSemesterPlans;
      //rootGetters["semester/getSemesters"],
    //  helperArrayForSemesterPlans,
    //  startOfStudy
  //  );

    await dispatch("updateCourseSelection");
  },

  async moveCourse( 
    {dispatch},
    {fromCourseIndex, toCourseIndex, 
    fromCoursePriority, toCoursePriority}
  ) {
    const unbookedCourses = state.courseSelection.semesterPlans[0].unbookedCourses;
    const bookedCourses = state.courseSelection.semesterPlans[0].bookedCourses;
    state.courseSelection.testNumber = 1;
    console.log(toCoursePriority);
    console.log('test');
    if(toCoursePriority == 99) return;
    var courseToMove = undefined;
    if(fromCoursePriority > 0)courseToMove = bookedCourses.splice(fromCourseIndex, 1)[0];
    else courseToMove = unbookedCourses.splice(fromCourseIndex, 1)[0];
    console.log('test');
    if(toCoursePriority > 0){

      //if(bookedCourses[toCoursePriority - 1 != undefined]){
        //const swapper = bookedCourses.splice(toCoursePriority-1, 1, courseToMove)[0];
     // }
      courseToMove.priority = toCoursePriority;
      bookedCourses[toCoursePriority - 1] = courseToMove;
    }else{
      unbookedCourses.splice(toCourseIndex, 0, courseToMove);
    }
    await dispatch("updateCourseSelection");
  },
  async addCoursePriority( {dispatch}){
    state.courseSelection.testNumber++;
    var test = state.courseSelection.semesterPlans[0].bookedCourses[0];
    console.log(test);
    state.courseSelection.semesterPlans[0].bookedCourses = [];
    state.courseSelection.semesterPlans[0].bookedCourses.push(test);
    console.log(state.courseSelection.semesterPlans[0].bookedCourses);
    await dispatch("updateCourseSelection");
    //state.courseSelection.semesterPlans[0].bookedCourses = [];
  },
};

export const getters = {

  getCourseSelection: (state) => {
    return state.courseSelections[0];
  },
  getCourseSelectionByUserId: (state) => (userId) => {
    return state.courseSelections.find((courseSelection) => courseSelection.userId === userId);
  },
  getSemesterPlan: (state) => {
    return state.courseSelection.semesterPlans[0];
  },
  getSemesterPlans: (state) => {
    return state.courseSelection.semesterPlans[0];
  },
  getCourseByPriority: (state) => (priority) => {
    return state.courseSelection.semesterPlans[0].bookedCourses.
    find((course) => course.priority === priority);
  },
};
