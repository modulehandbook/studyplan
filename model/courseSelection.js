const mongoose = require("mongoose"),
  { Schema } = mongoose,
  courseSelectionSchema = new Schema(
    {
      testNumber: Number,
      semesterPlans: [
        {
          semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester",
          },
          currentSemesterCount: {
            type: Number,
          },
          unbookedCourses: [
            {
              code: String,
              name: String,
              ects: Number,
            },
          ],
          bookedCourses: [
            {
              code: String,
              name: String,
              ects: Number,
              priority: Number,
            },
          ],
          selectionReasons: [
            {
              code: String,
              reason: String,
            },
          ],
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("CourseSelection", courseSelectionSchema);
