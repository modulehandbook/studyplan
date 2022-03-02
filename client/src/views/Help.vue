<template>
  <div>
    <BaseHeading>
      <h1>Hilfe</h1>
    </BaseHeading>
    <div class="questions">
      <div class="questions questions-question">
        <section id="willkommen">
          <p class="questions questions-question--text">
            Willkommen bei Studyplan!
          </p>
          <p class="text-content">
            Studyplan ist eine Webanwendung, die eine gerechtere und
            effizientere Belegung für IMI-Studenten anbietet durch:
          </p>
          <ul class="text-content">
            <li>Vorausplanung der Übungsgruppen</li>
            <li>bewusstere Belegung</li>
            <li>maximale Kursanzahl</li>
            <li>Priorisierung</li>
          </ul>
          <p class="text-content">
            Zudem ermöglicht der Studienplan von Julia Zamaitat, der hier auch
            aufzufinden ist, den Studenten einen besseren Überblick über ihre
            Studienplanung zu erhalten.
          </p>
        </section>
      </div>
      <div class="questions questions-question">
        <p class="questions questions-question--text">
          Hast du Fragen zur Belegung?
        </p>
        <p class="text-content">
          Die Studyplan Kursbelegung besteht aus zwei Phasen.
        </p>
        <p class="subdivision">Phase 1: Belegungssimulation</p>
        <p class="text-content">
          Die Phase der Belegungssimulation findet auf der gleichen Webseite wie
          die richtige Belegung statt und ist <b>unverbindlich</b>. Diese
          Ergebnisse dienen zur besseren Koordinierung der Übungsgruppen, damit
          zum Anfang der Belegungsphase bereits alle Kapazitäten der zur
          Verfügung stehenden Übungsgruppen ausgeschöpft werden können.
        </p>
        <p class="subdivision">Phase 2: Belegung</p>
        <p class="text-content">
          Die zweite Phase ist nun eine verbindliche Kursbelegung und die
          <a
            href="https://www.htw-berlin.de/studium/studienorganisation/kursbelegung/"
            target="blank"
            class="questions questions-question--answer"
            >Rangstufenordnung</a
          >
          zur Zulassung erfolgt wie im LSF. Jeder Student muss eine gewünschte
          Kursanzahl angeben, die er erhalten möchte. Daher sollte die
          Reihenfolge der Prioritäten sehr bewusst gewählt werden. Denn wird die
          angegebene Kursanzahl erreicht, wird man zu keinen weiteren Kursen mehr
          zugelassen. Zudem wird bei niedrigerer Priorisierung des Kurses
          die Wahrscheinlichkeit höher, dass dieser Kurs in das Auslosverfahren
          gerät wenn weniger freie Plätze verfügbar sind als es Anmeldungen in der Rangstufe der
          Studenten gibt.
        </p>
      </div>
      <div class="questions questions-question">
        <section id="prio">
          <p class="questions questions-question--text">
            Wie funktioniert die Kursbelegungs Priorität?
          </p>
          <p class="text-content">
            Die Studenten können ihre Modul-Favoriten in
            Prioritäten einordnen. Die erste Priorität spiegelt hier das für den
            Studenten wichtigste Modul wider. Sie ist in Phase 1 unverbindlich
            aber bestimmt neben der Rangstufe die Zulassung in Phase 2. Sollte
            der Student in einer der höheren Rangstufen sein, so wird er nur in
            so vielen Kursen zugelassen wie er als maximale Anzahl angab. Damit 
            soll verhindert werden, dass Studenten sich in zu vielen Kursen 
            anmelden, um eine höhere Auswahl an Möglichkeiten am Ende zu haben, 
            jedoch somit anderen Studenten gegebenenfalls wichtige Plätze wegnehmen. 
            Die offenen Kurse, die eine niedrigere Priorisierung erhielten werden dann
            verworfen und andere Studenten erhalten die Chance auf diese Plätze.
            Wenn die letzte Rangstufe erreicht ist, die noch die Möglichkeit auf
            einen Platz hat, so werden zuerst die Studenten mit höheren
            Priorisierungen des Kurses zugelassen und die mit den niedrigsten
            Priorisierungen ausgelost.
          </p>
        </section>
      </div>
      <div class="questions questions-question">
        <p class="questions questions-question--text">
          Bist du dir unsicher und möchtest nochmal selbst in der Studienordnung
          nachlesen?
        </p>
        <a
          href="https://www.htw-berlin.de/studium/studiengaenge/?no_cache=1"
          target="blank"
          class="questions questions-question--answer"
          >Zu den Studiengängen</a
        >
      </div>
      <div class="questions questions-question">
        <p class="questions questions-question--text">
          Möchtest du dich lieber persönlich beraten lassen?
        </p>
        <a
          href="https://www.htw-berlin.de/einrichtungen/zentrale-hochschulverwaltung/zentrum-fuer-studien-karriere-und-gruendungsberatung/allgemeine-studienberatung/"
          target="blank"
          class="questions questions-question--answer"
          >Zur Studienberatung der HTW</a
        >
      </div>
      <div class="questions questions-question">
        <p class="questions questions-question--text">
          Brauchst du Hilfe mit dem Tool selbst?
        </p>
        <a
          href="mailto:studyplan-imi@htw-berlin.de"
          target="blank"
          class="questions questions-question--answer"
          >Schreib uns eine Mail</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import BaseHeading from "../components/BaseHeading.vue";
export default {
  components: { BaseHeading },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.text-content {
  font-size: 18px;
}
.subdivision {
  font-size: 18px;
  font-weight: 600;
  text-decoration: underline;
  padding-top: 10px;
}

.questions {
  &-question {
    margin-bottom: 60px;
    margin-left: auto;
    margin-right: auto;
    max-width: 90vw;

    &--text {
      font-weight: 700;
      font-size: 20px;
      margin-bottom: 30px;
    }
    &--answer {
      text-decoration: underline;
      color: $htwGruen;
      font-size: 18px;
    }
  }

  ul {
    text-align: left;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
