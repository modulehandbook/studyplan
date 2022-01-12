import SemesterService from "@/services/SemesterService.js";

export const namespaced = true;

export const state = {
  semesters: [],
  pending: false,
};

export const mutations = {
  SET_SEMESTERS(state, semesters) {
    state.semesters = semesters;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async fetchSemesters({ commit }) {
    try {
      commit("SET_PENDING", true);
      const response = await SemesterService.fetchSemesters();
      const semesters = response.data;

      commit("SET_SEMESTERS", semesters);
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem fetching semesters: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
};

export const getters = {
  getSemesterByName: (state) => (name) => {
    if (!name) return;
    return state.semesters.find(
      (semester) => semester.name.toLowerCase() === name.toLowerCase()
    );
  },

  getSemesters: (state) => {
    return state.semesters;
  },

  getCurrentSemester: (state) => {
    const date = new Date();
    const year = date.getFullYear() % 100;
    const query =( date.getMonth() > 5 ? `WiSe${year}/${year+1}`: `SoSe${year}`);
    return state.semesters.find(
      (semester) => semester.name.toLowerCase() === query.toLocaleLowerCase()
    );
  },
};
