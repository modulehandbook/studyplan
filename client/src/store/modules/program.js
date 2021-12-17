import ProgramService from "@/services/Api/ProgramService.js";

export const namespaced = true;

export const state = {
  programs: [],
  program: {},
  pending: false,
};

export const mutations = {
  SET_PROGRAMS(state, programs) {
    state.programs = programs;
  },
  SET_PROGRAM(state, program) {
    state.program = program;
  },
  SET_PENDING(state, status) {
    state.pending = status;
  },
};

export const actions = {
  async fetchPrograms({ commit }) {
    try {
      commit("SET_PENDING", true);
      const response = await ProgramService.fetchPrograms();
      const programs = response.data;

      commit("SET_PROGRAMS", programs);
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem fetching programs: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async fetchProgram({ state, commit }, { code, version }) {
    commit("SET_PENDING", true);
    try {
      var program = getProgramByCodeAndVersion(state, code, version);
      if (program) {
        commit("SET_PROGRAM", program);
      } else {
        const response = await ProgramService.fetchProgram(code, version);
        let program = response.data;
        program.version = version;
        commit("SET_PROGRAM", program);
      }
    } catch (error) {
      const notification = {
        type: "error",
        message: "There was a problem fetching a program: " + error.message,
      };
      console.log(notification);
    } finally {
      commit("SET_PENDING", false);
    }
  },
  async getOfficialCoursesInSemester({ state }) {
    const semester = getSemester(state.program);
    if (!semester) return;
    const coursesInSemester = {};
    for (let i in semester) {
      //if (semester[i] == 0) continue; //ohne Wahlpflichtfächer
      let courses = [];
      let coursesInProgram = getCoursesInProgram(state.program);
      for (let y in coursesInProgram) {
        if (coursesInProgram[y].code.includes(".")) continue; //ohne B20.1, also required Submodule
        if (semester[i] == coursesInProgram[y].semester)
          courses.push(coursesInProgram[y]);
      }
      coursesInSemester[semester[i]] = courses;
    }
    return coursesInSemester;
  },
  async getModalCourses({ state }) {
    const semester = getSemester(state.program);
    if (!semester) return;
    const coursesInSemester = {};
    for (let i in semester) {
      if (semester[i] != 0) continue; //ohne Wahlpflichtfächer
      let courses = [];
      let coursesInProgram = getCoursesInProgram(state.program);
      for (let y in coursesInProgram) {
        if (coursesInProgram[y].code.includes(".")) continue; //ohne B20.1, also required Submodule
          if (coursesInProgram[y].code.includes("M")) continue;
        if (semester[i] == coursesInProgram[y].semester)
          courses.push(coursesInProgram[y]);
      }
      coursesInSemester[semester[i]] = courses;
    }
    return coursesInSemester;
  },
};

function getProgramByCodeAndVersion(state, code, version) {
  if (!state.program.code) return;
  if (
    state.program.code.toLowerCase() === code &&
    state.program.version == version
  )
    return state.program;
}

function getCoursesInProgram(program) {
  if (!program) return;
  const courses = program.courses;
  if (!courses) return;
  return courses.sort(function (a, b) {
    //sort in ascending order
    var lowerCaseA = a.code.match(/\d+/)[0];
    var lowerCaseB = b.code.match(/\d+/)[0];
    return lowerCaseA - lowerCaseB;
  });
}

function getSemester(program) {
  const courses = getCoursesInProgram(program);
  if (!courses) return;
  const semester = [];
  for (let i in courses) {
    let semesterCount = courses[i].semester;
    if (semester.indexOf(semesterCount) == -1) semester.push(semesterCount);
  }
  return semester.sort();
}
