const mongoose = require("mongoose"),
  { Schema } = mongoose,
  courseSelectionSchema = new Schema(
    {
      semesterPlans: [
        {
          semester: {
            type: Schema.Types.ObjectId,
            ref: "Semester",
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
              reasons: [String],
              other: String,
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
