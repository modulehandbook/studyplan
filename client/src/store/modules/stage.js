/* eslint-disable no-unused-vars */
import StageService from "@/services/StageService.js";

export const namespaced = true;

export const state = {
  nextDates: [],
  currentStage: {},
  pending: false,
};
export const mutations = {
  SET_NEXTDATES(state, nextDates) {
    state.nextDates = nextDates;
  },
  SET_CURRENTSTAGE(state, currentStage) {
    state.currentStage = currentStage;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async fetchStage({ commit }) {
    try {
      commit("SET_PENDING", true);
      const response = await StageService.fetchStage();
      const stage = response.data;
      commit("SET_CURRENTSTAGE", stage.currentStage);
      commit("SET_NEXTDATES", {
        idle: stage.nextDates.idle[0],
        courseSelection: stage.nextDates.courseSelection[0],
        evaluation: stage.nextDates.evaluation[0],
        courseResult: stage.nextDates.courseResult[0],
      });
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem fetching stage: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
};

export const getters = {
  getCurrentStage: (state) => {
    return state.currentStage;
  },
  getNextDate: (state) => {
    return state.nextDates;
  },
};
