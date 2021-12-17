/* eslint-disable no-unused-vars */
import CourseSelectionService from "@/services/StudyPlanService.js";

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
    try {
      commit("SET_PENDING", true);
      var courseSelection = getters.getCourseSelectionByUserId(userId);
      if (courseSelection) {
        commit("SET_COURSESELECTION", courseSelection);
      } else {
        const response = await CourseSelectionService.fetchCourseSelection(userId);
        const courseSelection = response.data;
        commit("SET_COURSESELECTION", courseSelection);
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
    try {
      commit("SET_PENDING", true);


      const response = await CourseSelectionService.createCourseSelection(state.courseSelection);
      const courseSelection = response.data;

      commit("SET_COURSESELECTION", courseSelection);
      await dispatch("fillEmptyCourseSelectionWithCourses", { startOfStudy });

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
    { state, rootGetters, dispatch },
    { startOfStudy }
  ) {
    let helperArrayForSemesterPlans = [];
    const officialCoursesInSemester = await dispatch(
      "program/getModalCourses",
      {},
      { root: true }
    );
    for (let semester in officialCoursesInSemester) {
      const courseCodes = [];
      for (let course in officialCoursesInSemester[semester]) {
        courseCodes.push({
          code: officialCoursesInSemester[semester][course].code,
          name: officialCoursesInSemester[semester][course].name,
          ects: officialCoursesInSemester[semester][course].ects,
        });
      }
      const obj = {
        currentSemesterCount: semester,
        semester: "",
        plannedCourses: courseCodes,
      };
      helperArrayForSemesterPlans.push(obj);
    }

    state.CourseSelection.semesterPlans = assignSemestersToSemesterPlans(
      rootGetters["semester/getSemesters"],
      helperArrayForSemesterPlans,
      startOfStudy
    );

    await dispatch("updateStudyPlan");
  },

  async moveCourse(
    { dispatch },
    { fromCourses, fromCourseIndex, toCourses, toCourseIndex }
  ) {
    const courseToMove = fromCourses.splice(fromCourseIndex, 1)[0];
    if (toCourseIndex == undefined) {
      toCourses.push(courseToMove);
      await dispatch("updateStudyPlan");
      return;
    }
    toCourses.splice(toCourseIndex, 0, courseToMove);
    await dispatch("updateStudyPlan");
  },

  async addSemester({ state, dispatch, rootGetters }) {
    let semesterPlans = state.studyPlan.semesterPlans;
    const semesters = rootGetters["semester/getSemesters"].slice();
    let semesterToAdd;

    //adding the semester name to semesterPlan
    for (let i = 0; i < semesters.length; i++) {
      if (
        semesters[i].name ===
        semesterPlans[semesterPlans.length - 1].semester.name
      ) {
        semesterToAdd = semesters.splice(i + 1, 1);
        break;
      }
    }
    semesterPlans.push({
      currentSemesterCount:
        semesterPlans[semesterPlans.length - 1].currentSemesterCount + 1,
      semester: semesterToAdd[0],
      plannedCourses: [],
    });
    await dispatch("updateStudyPlan");
  },

  async deleteSemester({ state, dispatch, commit }, { semesterIndex }) {
    let semesterPlans = state.studyPlan.semesterPlans;
    const removed = semesterPlans.splice(semesterIndex, 1);
    //change semester names
    var newSemesterName = removed[0].semester.name;
    var newId = removed[0].semester._id;

    for (let i = semesterIndex; i < semesterPlans.length; i++) {
      semesterPlans[i].currentSemesterCount -= 1;
      let oldSemesterName = semesterPlans[i].semester.name;
      let oldId = semesterPlans[i].semester._id;
      semesterPlans[i].semester.name = newSemesterName;
      semesterPlans[i].semester._id = newId;

      newSemesterName = oldSemesterName;
      newId = oldId;
    }
    state.studyPlan.semesterPlans = semesterPlans;

    commit("SET_STUDYPLAN", state.studyPlan);
    await dispatch("updateStudyPlan");
  },

  async toggleBookedStateOfCourseInSemester(
    { state, dispatch, getters },
    { courseCode, parentCourseCode, semester, requiredCourses }
  ) {
    let semesterPlan = getters.getSemesterPlan(semester);

    if (!parentCourseCode) {
      let course = getCourseInPlannedCoursesOfSemester(
        courseCode,
        semesterPlan
      );
      course.booked = !course.booked;
    } else {
      let course = getCourseInPlannedCoursesOfSemester(
        parentCourseCode,
        semesterPlan
      );
      const index = course.bookedThrough.indexOf(courseCode);
      if (index > -1) {
        course.bookedThrough.splice(index, 1);
        course.booked = false;
      } else {
        course.bookedThrough.push(courseCode);
        if (
          requiredCourses.length > 0 &&
          requiredCourses.length != course.bookedThrough.length
        ) {
          course.booked = false;
        } else {
          course.booked = true;
        }
      }
    }
    await dispatch("updateStudyPlan");
  },
  async togglePassedStateOfCourseInSemester(
    { state, dispatch, getters },
    { courseCode, parentCourseCode, semester, requiredCourses }
  ) {
    let semesterPlan = getters.getSemesterPlan(semester);

    if (!parentCourseCode) {
      let course = getCourseInPlannedCoursesOfSemester(
        courseCode,
        semesterPlan
      );
      course.passed = !course.passed;
    } else {
      let course = getCourseInPlannedCoursesOfSemester(
        parentCourseCode,
        semesterPlan
      );
      const index = course.passedThrough.indexOf(courseCode);
      if (index > -1) {
        course.passedThrough.splice(index, 1);
        course.passed = false;
      } else {
        course.passedThrough.push(courseCode);
        if (
          requiredCourses.length > 0 &&
          requiredCourses.length != course.passedThrough.length
        ) {
          course.passed = false;
        } else {
          course.passed = true;
        }
      }
    }
    await dispatch("updateStudyPlan");
  },
};

export const getters = {
  getStudyPlanByUserId: (state) => (userId) => {
    return state.studyPlans.find((studyPlan) => studyPlan.userId === userId);
  },
  getSemesterPlans: (state) => {
    const studyPlan = state.studyPlan;
    if (!studyPlan) return;
    return studyPlan.semesterPlans;
  },
  getSemesterPlan: (state) => (semester) => {
    let semesterPlans = state.studyPlan.semesterPlans;
    if (!semesterPlans) return;
    for (let i in semesterPlans) {
      if (semesterPlans[i].semester.name === semester.name) {
        return semesterPlans[i];
      }
    }
  },

  getStateOfCourse:
    (state, getters) => (courseCode, parentCourseCode, semester) => {
      const semesterPlan = getters.getSemesterPlan(semester);
      if (!parentCourseCode) {
        let course = getCourseInPlannedCoursesOfSemester(
          courseCode,
          semesterPlan
        );
        return {
          booked: course.booked || course.bookedThrough.length > 0,
          passed: course.passed || course.passedThrough.length > 0,
        };
      } else {
        let course = getCourseInPlannedCoursesOfSemester(
          parentCourseCode,
          semesterPlan
        );
        const index = course.bookedThrough.indexOf(courseCode);
        if (index > -1) {
          var booked = true;
          return {
            booked: true,
            passed:
              course.passedThrough.indexOf(courseCode) > -1 ? true : false,
          };
        } else {
          return {
            booked: false,
            passed: false,
          };
        }
      }
    },

  getBookedAndPassedThroughCourses:
    (state, getter) => (parentCourseCode, semester) => {
      const semesterPlan = getter.getSemesterPlan(semester);
      let course = getCourseInPlannedCoursesOfSemester(
        parentCourseCode,
        semesterPlan
      );
      if (!course) return [];
      return {
        bookedThrough: course.bookedThrough,
        passedThrough: course.passedThrough,
      };
    },
  getIsChildCourseBookedYet: (state, getters) => (childCourseCode) => {
    const semesterPlans = state.studyPlan.semesterPlans;
    for (let plan in semesterPlans) {
      for (let course in semesterPlans[plan].plannedCourses) {
        if (
          semesterPlans[plan].plannedCourses[course].bookedThrough.indexOf(
            childCourseCode
          ) != -1
        ) {
          return true;
        }
      }
    }
    return false;
  },
};

function assignSemestersToSemesterPlans(
  semesters,
  semesterPlans,
  startOfStudy
) {
  for (let i in semesters) {
    if (semesters[i].name === startOfStudy.name) {
      semesters = semesters.splice(i);
      break;
    }
  }
  for (let i = 0; i < semesterPlans.length; i++) {
    semesterPlans[i].semester = semesters[i];
  }
  return semesterPlans;
}

function getCourseInPlannedCoursesOfSemester(code, semesterPlan) {
  if (!semesterPlan.plannedCourses) return;
  for (let course in semesterPlan.plannedCourses) {
    if (semesterPlan.plannedCourses[course].code === code) {
      return semesterPlan.plannedCourses[course];
    }
  }
}
