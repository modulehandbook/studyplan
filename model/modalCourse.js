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

      students: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      reasonsForSelecton: { 
        teacher: Number,
        time: Number,
        interest: Number,
        easy: Number,
        careerRelevant: Number,
      },
      availablePlaces: Number,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("ModalCourse", modalCourseSchema);
