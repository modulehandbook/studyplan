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
  SET_MODACOURSE(state, modalCourse) {
    state.modalCourse = modalCourse;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async createCoures(
    {state, commit, getters},
    {courseName, code, avaiblePlaces, semester}
  ){
    try{
      commit("SET_PENDING", true)
      state.modalCourse = {
        courseName: courseName,
        code: code,
        avaiblePlaces: avaiblePlaces,
        semester: semester,
      };
      const response = await ModalCourseService.createModalCourse(state.modalCourse);
      const modalCourse = response.data;
      commit("SET_MODALCOURSE", modalCourse)
    } catch(error){
      const notification = {
        type: "error",
        message: "there was a problem creating modal course" + error.message
      };
      console.log(notification);
      } finally{
        commit("SET_PENDING", false);
    }
  },
  async fetchCourse(
    { state, commit, getters },
    { program, version, code, semester }
  ) {
    //ask for the semester route -> if there is a 404, so no semester info is there yet,
    // check the basic vuex course state
    try {
        commit("SET_PENDING", true);
        await CourseService.fetchCourseWithSemester(
        program,
        version,
        code,
        semester
        )
        .then((response) => {
            commit("SET_COURSE", response.data); //don't save the course to vuex, because we don't save the semester versions
        })
        .catch(async (error) => {
            if (error.response.status == 404) {
            //there is no semester information yet, so fetching and saving the basic course
            } else {
            const notification = {
                type: "error",
                message:
                "There was a problem fetching course with code " +
                code +
                ": " +
                error.message,
            };
            console.log(notification);
            }
        });
    } finally {
      commit("SET_PENDING", false);
    }
  },
};

export const getters = {
  getCourseByCode: (state) => (code) => {
    if (!state.courses) return;
    return state.courses.find((course) => course.course.code === code);
  },
};
