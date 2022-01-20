const User = require("../model/user"),
  StudyPlan = require("../model/studyPlan"),
  Semester = require("../model/semester"),
  ModalCourse = require("../model/modalCourse"),
  CourseSelection = require("../model/courseSelection"),
  Stage = require("../model/stage"),
  mongoose = require("mongoose"),
  bcrypt = require("bcryptjs");

//connect mongoose
const mongo = process.env.MONGODB_URI || "mongodb://mongo-db:27017/studyplan";
mongoose
  .connect(mongo, { useNewUrlParser: true })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });

async function loadUser() {
  await Semester.deleteMany({});
  await StudyPlan.deleteMany({});
  await User.deleteMany({});
  await ModalCourse.deleteMany({});
  await CourseSelection.deleteMany({});
  await Stage.deleteMany({});

  let semesterData = [];
  let i = 10;
  for (i; i <= 55; i++) {
    semesterData.push({ name: `SoSe${i}` });
    semesterData.push({ name: `WiSe${i}/${i + 1}` });
  }
  for (let semester in semesterData) {
    await Semester.create(semesterData[semester]);
  }

  const userData = [
    new User({
      username: "test",
      password: bcrypt.hashSync("test", 8),
      email: "test@mail.de",
      isVerified: true,
    }),
    new User({
      username: "admin",
      password: bcrypt.hashSync("admin", 8),
      email: "admin@mail.de",
      isVerified: true,
      isAdmin: true,
    }),
  ];

  const users = await User.create(userData);
  const ModalCourseData = [
    {
      name: "AI for Games",
      code: "GT1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [
          "Wegesuche",
          "Bewegungsplanung",
          "Entscheidungsfindung und -bewertung",
          "Spielbäume",
          "Lernende Algorithmen",
        ],
        learningOutcomes: [
          "Die Teilnehmer sind in der Lage die grundlegenden Elemente einer künstlichen Intelligenz zu implementieren und zu kombinieren, um diese in Computerspielen oder anderen interaktiven Systemen einzusetzen.",
        ],
        recommendedRequirements: [],
        currentTopic: undefined,
        examType: "Software-Übung und Klausur (90 Minuten)",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
    {
      name: "Game Technology & Interactive Systems",
      code: "GTAT1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [], //TODO
        learningOutcomes: [], //TODO
        recommendedRequirements: [], //TODO
        currentTopic: "", //DODO
        examType: "Software-Übung und Klausur (90 Minuten)",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
    {
      name: "Bild- und Videokompression",
      code: "VC1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [
          "Statistische Grundlagen der Signalverarbeitung",
          "Differential Pulse Code Modulation",
          "Diskrete Cosinus–Transformation",
          "Wavelet–Transformation",
          "JPEG und JPEG2000 Bildkompression",
          "Lineare und Vektorquantisierung",
          "Bewegungsdetektion und Bewegungsprädiktion",
          "MPEG und verwandte Video Kompressionsverfahren",
        ],
        learningOutcomes: [
          "Kenntnisse im Bereich der Signalverarbeitung und –analyse",
          "Kenntnisse im Bereich der Bild- und Video–Kompressionsverfahren",
          "Beurteilung der Bild- und Videoqualität, erkennen und beurteilen von Kompressionsartefakten",
          "Kenntnisse der wesentlichen Standards für Bild- und Videoformate",
          "Praktisches Wissen zur effizienten Implementierung von Verfahren der Bildkompression",
        ],
        recommendedRequirements: ["Bildverarbeitung"],
        currentTopic: undefined,
        examType:
          "Programmieraufgaben mit Rücksprache (Prüfungsvoraussetzung) und Klausur (90 Min.)",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
    {
      name: "Visual Computing",
      code: "VCAT1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [], //TODO
        learningOutcomes: [], //TODO
        recommendedRequirements: [], //TODO
        currentTopic: "", //DODO
        examType: "Programmierübungen mit Rücksprache und Klausur (90 min.",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
    {
      name: "Verteilte Systeme",
      code: "WT1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [
          "Verteilte Architekturen",
          "Multitasking",
          "Vektor-Prozessierung",
          "Multi-Threading, Multi-Processing, Multi-Imaging, Grids",
          "Verteilte Datenbanken: Replikation, Caching",
          "Verteilte Dateienverwaltung",
          "Web Services, Service-Orientierte Architektur",
        ],
        learningOutcomes: [
          "Die Studierenden kennen unterschiedliche Architekturen von verteilten Systemen.",
          "Sie kennen Entwurfsprinzipen für verteilte Systeme.",
          "Die Studierenden erwerben die Fähigkeit, ein verteiltes System zu spezifizieren und zu implementieren",
          "Sie erwerben praktische Kenntnisse für das verteilte Rechnen mit Java oder .NET Technologien",
          "Sie haben sich mit Kommunikation in verteilten Anwendungen, Synchronisation, Authentifizierungsaspekten, und Kryptographie beschäftigt.",
          "Sie verstehen die Gründe für eine Trennung von Infrastruktur und Anwendungslogik.",
          "Die Studierenden erlangen Kenntnisse der internationalen Aspekte, die bei verteilten Systemen von großer Bedeutung sind.",
        ],
        recommendedRequirements: ["Netzwerke"],
        currentTopic: undefined,
        examType: "Programmierübungen mit Rücksprache und Klausur (90 min.)",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
    {
      name: "Web Technology",
      code: "WTAT1",
      info: {
        CTS: 5,
        language: "Deutsch",
        contents: [], //TODO
        learningOutcomes: [], //TODO
        recommendedRequirements: [], //TODO
        currentTopic: "", //DODO
        examType: "Klausur (90 min.)",
        SWS: 4,
        professor: undefined, //TODO
        room: undefined, //TODO
      },
      availablePlaces: undefined, //TODO
    },
  ];

  const sem = await Semester.findOne({ name: "SoSe22" });

  for (let course of ModalCourseData) {
    course.students = [userData[0]._id];
    course.reasonsForSelection = {
      teacher: 0,
      time: 0,
      interest: 0,
      easy: 0,
      careerRelevant: 0,
      other: 0,
    };
    course.semester = sem._id;

    await ModalCourse.create(course);
  }

  await Stage.create({
    //TODO
    currentStage: "COURSE-SELECTION",
    nextDates: {
      idle: [{ date: "2022-01-15" }],
      courseSelection: [{ date: "2022-01-16" }],
      evaluation: [
        { date: "2022-01-17" },
        { date: "2022-01-16" },
        { date: "2022-01-15" },
        { date: "2022-01-14" },
      ],
      courseResult: [{ date: "2022-01-18" }],
    },
    currentSemester: sem._id,
  });

  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("users: " + JSON.stringify(users));
  console.log("----");
  return ".";
}

loadUser().then(() => {
  mongoose.disconnect();
  console.log("database connection closed after seeding.");
});
