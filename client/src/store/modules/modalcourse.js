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
    {state, commit},
    {courseName, code, availablePlaces, semester}
  ){
    try{
      commit("SET_PENDING", true)
      state.modalCourse = {
        name: courseName,
        code: code,
        availablePlaces: availablePlaces,
        semester: semester,
      };
      const response = await ModalCourseService.createModalCourse(state.modalCourse);
      const modalCourse = response.data;
      const test = await ModalCourseService.updateModalCourse(modalCourse);
      
      commit("SET_MODALCOURSE", test.data);
      state.modalCourses.push(test.data);
      console.log("the state assumes this value");
      console.log(test.data);
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
    {  commit },
  ) {
    //ask for the semester route -> if there is a 404, so no semester info is there yet,
    // check the basic vuex course state
    try {
        commit("SET_PENDING", true);
        console.log(state.modalCourses);
        commit("SET_MODALCOURSE", state.modalCourses[0]);
        console.log(state.modalCourse)
        
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchCourses(
    {commit},
  ){
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
      })
    } finally{
      commit("SET_PENDING", false);
    }
  },
  async deleteCourse(
    {state, commit,},
    {index}
  ){
    try{
      commit("SET_PENDING", true);
      const courseToDelete = state.modalCourses.splice(index, 1)[0];

      await ModalCourseService.deleteModalCourse(courseToDelete);
      commit("SET_MODALCOURSES", state.modalCourses);
    }finally{
      commit("SET_PENDING", false);
    }
  },
};

export const getters = {
  getCourses: (state) => {return state.modalCourses;},
  getCourseByCode: (state) => (code) => {
    if (!state.courses) return;
    return state.courses.find((course) => course.course.code === code);
  },
  getCoursesBySemester: (state) => (semester) => {
    if(!state.modalCourses) return;
    return state.modalCourses.filter((modalCourse) => modalCourse.modalCourse.semester === semester);
  },
};
