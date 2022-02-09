<template>
  <div>
    <p v-if="isFilled">{{ priority }}. Priorit&auml;t</p>
    <p v-if="!isFilled">
    {{ priority }}. Priorit&auml;t 
    <br>   
    Kurs reinziehen
    </p>
  </div>
</template>

<script>
export default {
  props: {
    priority: {
      type: Number,
      required: true,
    },
    isUnbookedCourses: {
      type: Boolean,
      required: true,
    },
    isFilled: {
      type: Boolean,
      required: true,
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
</style>
