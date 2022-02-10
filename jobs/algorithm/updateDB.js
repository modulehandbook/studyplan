const ModalCourse = require("../../model/modalCourse");
const User = require("../../model/user");
const Semester = require("../../model/semester");
require("../../model/courseSelection");
module.exports.updateDB = async (solution, currentSemester) => {
  const semester = await Semester.find({ name: currentSemester });
  const updateCourse = async function (code, students) {
	  console.log(students)
    for (const i in students) {
      const email = students[i];
      students[i] = await User.findOne({ email: email }, "_id").clone(); //TODO: dont know why i need clone(); maybe thats not good practice
      if (students[i] == null)
        throw new Error("Can't find User with email: " + email);
    }
    await ModalCourse.updateOne(
      { semester: semester, code: code },
      {
        $push: {
          students: students,
        },
      }
    ).catch((err) => console.log(err));
  };
  for (const [code, students] of Object.entries(solution)){
    await updateCourse(code, students.map((s) => s.email));
  }

};
