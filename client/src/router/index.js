import { createRouter, createWebHashHistory } from "vue-router";
import ExampleStudyPlan from "../views/ExampleStudyPlan.vue";
import Login from "../views/Login.vue";
import StudyPlan from "../views/StudyPlan.vue";
import Help from "../views/Help.vue";
import CourseSelection from '../views/CourseSelection.vue'
import CourseSurvey from '../views/CourseSurvey.vue'
import ModalCourse from '../views/ModalCourse.vue';
import Profile from "../views/Profile.vue";
import Register from "../views/Register.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import Imprint from "../views/Imprint.vue";
import ProgramSelection from "../views/ProgramSelection.vue";
import BaseModalChildCourse from "../components/BaseModalChildCourse.vue";
import BaseModalParentCourse from "../components/BaseModalParentCourse.vue";
import BaseModalCourseDetailsWindow from "../components/BaseModalCourseDetailsWindow.vue";
import BaseDeleteStudyplanModal from "../components/BaseDeleteStudyplanModal.vue";
import BaseChangePasswordModal from "../components/BaseChangePasswordModal.vue";
import BaseResendVerification from "../components/BaseResendVerification.vue";
import BaseResetPassword from "../components/BaseResetPassword.vue";
import { store } from "../store";
import { AccessTokenValidation } from "../helper/accessTokenValidation.js";

const routes = [
  { path: "/", redirect: { name: "StudyPlan" } },
  {
    path: "/login",
    name: "Login",
    component: Login,
    children: [
      {
        path: "/reset-password",
        component: BaseResetPassword,
        name: "baseResetPassword",
      },
    ],
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    children: [
      {
        path: "/resend-verification",
        component: BaseResendVerification,
        name: "baseResendVerification",
      },
    ],
  },
  {
    path: "/select-program",
    name: "ProgramSelection",
    component: ProgramSelection,
  },
  {
    path: "/my-studyplan",
    name: "StudyPlan",
    component: StudyPlan,
    children: [
      {
        path: ":program/:version/:code/:semester",
        component: BaseModalParentCourse,
        name: "baseModalParentCourse",
      },
      {
        path: ":program/:version/:parentCode/:code/:semester",
        component: BaseModalChildCourse,
        name: "baseModalChildCourse",
      },
    ],
  },
  {
    path: "/example-studyplan",
    name: "ExampleStudyPlan",
    component: ExampleStudyPlan,
    children: [
      {
        path: ":program/:version/:code",
        component: BaseModalParentCourse,
        name: "exampleStudyplanBaseModalParentCourse",
      },
      {
        path: ":program/:version/:parentCode/:code",
        component: BaseModalChildCourse,
        name: "exampleStudyplanBaseModalChildCourse",
      },
    ],
  },
  {
    path: "/courseselection",
    name: "CourseSelection",
    component: CourseSelection,
  },
  {
    path: "/coursesurvey",
    name: "CourseSurvey",
    component: CourseSurvey,
  },
  {
    path: "/modalcourse",
    name: "ModalCourse",
    component: ModalCourse,
    children: [
      {
        path: ":semester/:code",
        component: BaseModalCourseDetailsWindow,
        name: "baseModalCourseDetails",
      },
    ],
  },
  {
    path: "/hilfe",
    name: "Help",
    component: Help,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    children: [
      {
        path: "/delete-studyplan",
        component: BaseDeleteStudyplanModal,
        name: "baseDeleteStudyplanModal",
      },
      {
        path: "/change-password",
        component: BaseChangePasswordModal,
        name: "baseChangePasswordModal",
      },
    ],
  },
  {
    path: "/datenschutz",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
  },
  {
    path: "/impressum",
    name: "Imprint",
    component: Imprint,
  },
];

const router = createRouter({
  history: createWebHashHistory(""),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = [
    "/login",
    "/register",
    "/hilfe",
    "/resend-verification",
    "/reset-password",
    "/impressum",
    "/datenschutz",
  ];
  const authRequired = !publicPages.includes(to.path);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!authRequired) {
    next();
    return;
  }
  if ((!user || user == null) && router.options.history.base != "/register#") {
    console.log(router.options.history.base);
    next("/login");
    return;
  } else if (!user || user == null) {
    next("/register");
  }

  let loggedIn = AccessTokenValidation.parseJwt(user.accessToken);

  if (loggedIn.exp < Date.now() / 1000) {
    // token expired
    loggedIn = false;
    store.dispatch("user/logout");
    next("/login");
  } else {
    next();
  }
});

export default router;
