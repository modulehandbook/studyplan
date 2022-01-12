<template>
<div>
  <div class="semesterRow">
       <button v-on:click=" isVisible = !isVisible">{{semester.name}}</button>
    <div class="courses"
     :class="{
            'courses--visible': !isVisible,
          }">
     
      <div
          class="course"
          v-for="(course, $courseIndex) in coursesInSemester"
          :key="$courseIndex"
      >
        <router-link
            class="course-content-container"
            :to="{
              name: 'courseDetails',
              params: {
                code: course.code,
                semester: semester.name,
              },
            }"
            draggable="false"
          >
        <div
          class="course-content-container-content"
         
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
        </router-link>
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
    semester: {
      type: Object,
      required: true,
    }
  
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
  .semesterRow {
    max-width: 100%;
    align-items: center;
    grid-template-columns: 0.2fr 0.8fr;
    row-gap: 0px;

  .courses {
    min-width: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
      &--visible {
            display: none;
          }

   .course {
      margin: 20px 25px 20px 0;
      display: flex;
      align-items: center;
      min-height: 87px;
      width: 150px;
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
    }
  }
</style>

