/*warning
This deletes ModalCourses; This requires Semester
*/
const Semester = require("../model/semester"),
  ModalCourse = require("../model/modalCourse"),
  mongoose = require("mongoose");

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
    seedModalCourses().then(() => {
      mongoose.disconnect();
      console.log("database connection closed after seeding.");
    });
  });

async function seedModalCourses() {
  await ModalCourse.deleteMany({});

  const sem = await Semester.findOne({ name: "SoSe22" });

  for (let course of modalCourseData) {
    course.reasonsForSelection = {
      teacher: 0,
      time: 0,
      interest: 0,
      easy: 0,
      careerRelevant: 0,
      other: [],
    };
    course.semester = sem._id;
    course.program = "IMI-B";
    course.semesterInProgram = [5, 6];
  }

  let result = await Promise.all(
    modalCourseData.map(async (course) => await ModalCourse.create(course))
  );
  console.log("----");
  console.log("database seeded with:");
  console.log("----");
  console.log("modalCourses: " + result);
  console.log("----");
  return ".";
}

const modalCourseData = [
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
