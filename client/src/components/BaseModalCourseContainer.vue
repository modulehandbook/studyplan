<template>
  <div>
    <div class="courses">
      <div
          class="course"
          v-for="(course, $courseIndex) in coursesInSemester"
          :key="$courseIndex"
      >
        <div
          class="course-content-container-content"
          :class="{
            'course-content-container-content--booked': course.booked,
            'course-content-container-content--passed': course.passed,
          }"
        >
          <div class="course-content-container-content-text">
            <p class="course-content-container-content-text--code">
              {{ course.code }}
            </p>
            <p>
              {{ course.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    coursesInSemester: {
      type: Array,
      required: true,
    },
  },
  data(){
    return {
      isVisible: false,
    };
  },
  computed: {
    ...mapState("modalcourses", ["modalCourses"]),
  },
  };
</script>
<style lang="scss" scoped>
.course {
      margin: 20px 25px 20px 0;
      display: flex;
      align-items: center;
      min-height: 87px;
      transform: translate(0, 0);

      a {
        text-decoration: none;
        color: inherit;
      }

      &-content-container {
        transform: translate(0, 0);
        min-height: 87px;
        border-radius: 14px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;

        &-content {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 100%;
          min-height: 87px;
          background: rgba(193, 193, 193, 0.55);
          background-size: 100px 100px;
          border: 1px solid rgba(193, 193, 193, 0.3);
          border-radius: 14px;
          &:hover {
            background: rgba(193, 193, 193, 0.7);
          }

          &--visible {
            background-color: rgba(118, 185, 0, 0.45) !important;
            border: 1px solid rgba(118, 185, 0, 0.3);
            &:hover {
              background-color: rgba(118, 185, 0, 0.7) !important;
            }
          }

          &-text {
            max-width: 100%;
            height: 100%;

            overflow: hidden;

            p {
              font-size: 12px;
              font-weight: 700;
              padding: 3px 5px;
              margin: 0;
              max-width: 95%;
              word-wrap: break-word;
              border-radius: 14px;
            }
          }
        }
      }
    }
</style>

