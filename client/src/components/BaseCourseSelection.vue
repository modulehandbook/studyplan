<template>
  <div class="container">
    <div class="shadowBox">
    <BaseCourseSelectionRow
        class="course"
        :coursePriority="0"
        :courses="courses"
        :otherCourses="bookedCourses"
        :isUnbookedCourses="true"
      />
       <BaseCourseSelectionRow
        class="course"
        :coursePriority="1"
        :courses="bookedCourses"
        :otherCourses="courses"
        :isUnbookedCourses="false"
      />
      <router-view></router-view>
  
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
      default: () => [],
    },
    bookedCourses: {
      type: Array,
      default: () => [],
    }
  },
  async mounted() {
    console.log("test");
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
p {
  font-weight: 700;
}

.container {
  display: grid;
  padding: 0 2rem;
  margin: 0 auto;
  max-width: 1350px;
  border-radius: 20px;

  @media screen and (max-width: 1400px) {
    max-width: 90% !important;
  }

  .shadowBox {
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.23);
    border-radius: 20px;
  }
  .semester {
    background: white;
    &:nth-child(odd) {
      background: rgba(118, 185, 0, 0.1) !important;
    }
    &:first-of-type {
      border-radius: 20px 20px 0 0;
    }
    &:last-of-type {
      border-radius: 0 0 20px 20px;
    }
  }
}
.addSemester {
  &__button {
    text-decoration: none;
    background: none;
    border: none;
    margin: 40px 0 20px 0;
    color: $htwGruen;
    cursor: pointer;
  }

  &__text {
    margin: 0;
    color: $htwGruen;
  }
}
</style>
