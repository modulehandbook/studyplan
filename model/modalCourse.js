const mongoose = require("mongoose"),
  { Schema } = mongoose,
  modalCourseSchema = new Schema(
    {
      name: String,
      code: String,
      semester: {
        type: Schema.Types.ObjectId,
        ref: "Semester",
      },
      info: {
        CTS: Number,
        language: String,
        contents: [String],
        learningOutcomes: [String],
        recommendedRequirements: [String],
        currentTopic: String,
        examType: String,
        SWS: Number,
        professor: String,
        room: String,
      },

      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      reasonsForSelection: {
        teacher: Number,
        time: Number,
        interest: Number,
        easy: Number,
        careerRelevant: Number,
        other: Number,
      },
      availablePlaces: Number,
      program: String,
      semesterInProgram: [Number],
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("ModalCourse", modalCourseSchema);
