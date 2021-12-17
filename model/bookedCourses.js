const mongoose = require("mongoose"),
  { Schema } = mongoose,
  bookedCoursesSchema = new Schema(
    {
      semesterPlans: [
        {
          semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester",
          },
          currentSemesterCount: {
            type: Number,
          },
          unbookedCourses:[
            {
              code: String,
              name: String,
              ects: Number,
              priority: Number,
            },
          ]
          ,
          bookedCourses: [
            {
              code: String,
              name: String,
              ects: Number,
              priority: Number,
            },
          ],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("bookedCourses", bookedCoursesSchema);
