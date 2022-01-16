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
      info:{
        CTS: Number,
        language: String,
        shortText: String,
        longText: String,
        currentTopic: String,
        SWS: Number,
        type: String,
        professor: String,
        room: String,
        pdf: String
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
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("ModalCourse", modalCourseSchema);
