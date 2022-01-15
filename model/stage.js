const mongoose = require("mongoose"),
  { Schema } = mongoose,
  stageSchema = new Schema(
    {
      currentSemester: {
        type: Schema.Types.ObjectId,
        ref: "Semester",
      },
      currentState: {
        type: String,
        enum: ["IDLE", "COURSE-SELECTION", "EVALUATION", "COURSE-RESULT"],
      },
      nextDates: {
        idle: [{ date: Date }],
        courseSelection: [{ date: Date }],
        evaluation: [{ date: Date }],
        coureseResult: [{ date: Date }],
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Stage", stageSchema);
