import animes from "../public/animes.json" assert { type: "json" };
import documentsRelations from "../public/roberta-document-groups.json" assert { type: "json" };
import Fs from "fs";
import Path from "path";

console.log(animes.names.length, animes.content.length);

const documents = animes.content.map((text = "") => {
  return text.toLowerCase().replace(/[^a-z ]+/g, " ");
});

function separeDocumentIntoSentences(document) {
  const sentences = [];
  const maxSentences = Math.floor(document.split(" ").length / 16);

  const currTextSplited = document.split(" ");

  for (let i = 0; i < maxSentences; i++) {
    const sentence = currTextSplited.splice(0, 16).join(" ");

    sentences.push(sentence.trim());
  }

  return sentences.filter((s) => s.split(" ").length > 5);
}

function createLabeledSentences(documents, documentsRelations) {
  const labeledSentences = {
    documentGroups: [],
    noMatch: [],
  };

  const { documentGroups, noMatch } = documentsRelations;

  console.log("document groups len: ", documentGroups.length, noMatch.length);

  for (let i = 0; i < documentGroups.length; i++) {
    const documentGroup = documentGroups[i];

    const sentences = [];

    for (const documentId of documentGroup) {
      const document = documents[documentId];

      const sentencesInDocument = separeDocumentIntoSentences(document);

      sentences.push(...sentencesInDocument);
    }

    labeledSentences.documentGroups.push({ groupId: i, weight: 1, sentences });
  }

  for (const documentId of noMatch) {
    const document = documents[documentId];

    const sentencesInDocument = separeDocumentIntoSentences(document);

    labeledSentences.noMatch.push({
      docId: documentId,
      weight: 1,
      sentences: sentencesInDocument,
    });
  }

  return labeledSentences;
}

function createSentenceDocumentRelations(
  documents,
  labeledSentences,
  documentsRelations
) {
  const sentenceDocumentsRelations = [];

  const { documentGroups: labeledDocumentSentences, noMatch: labeledNoMatch } =
    labeledSentences;

  const { documentGroups } = documentsRelations;

  console.log(labeledDocumentSentences.length, labeledNoMatch.length);
  console.log("relations docs group len: ", documentGroups.length);

  for (let i = 0; i < labeledDocumentSentences.length; i++) {
    const labeledDocumentSentence = labeledDocumentSentences[i];

    const { groupId, weight, sentences } = labeledDocumentSentence;

    const documentGroup = documentGroups[groupId];

    const sentenceRelations = [];

    for (const sentence of sentences) {
      let randIdx = 0;

      do {
        randIdx = Math.floor(Math.random() * documents.length);
      } while (documentGroup.includes(randIdx));

      // console.log("rand idx: ", randIdx);

      sentenceRelations.push([sentence, randIdx, 0]);
    }

    for (const docId of documentGroup) {
      // console.log("doc id: ", docId);

      const passedSentences = [];

      const maxSentences = sentences.length < 16 ? sentences.length : 16;

      for (let j = 0; j < maxSentences; j++) {
        let randomSentIdx = 0;

        do {
          randomSentIdx = Math.floor(Math.random() * sentences.length);
        } while (passedSentences.includes(randomSentIdx));

        passedSentences.push(randomSentIdx);

        const sentence = sentences[randomSentIdx];

        sentenceRelations.push([sentence, docId, weight]);
      }
    }

    console.log("step: ", i);
    console.log(sentenceRelations.length);
    // console.log(sentenceRelations[0]);

    sentenceDocumentsRelations.push(...sentenceRelations);
  }

  for (const noMatch of labeledNoMatch) {
    const { docId, weight, sentences } = noMatch;

    const sentenceRelations = [];

    sentences.map((sentence) => {
      sentenceRelations.push([sentence, docId, weight]);
    });

    sentenceDocumentsRelations.push(...sentenceRelations);
  }

  return sentenceDocumentsRelations;
}

function main() {
  console.time("main");

  const labeledSentences = createLabeledSentences(
    documents,
    documentsRelations
  );

  Fs.writeFileSync(
    Path.resolve("./public/roberta-train-sentence-groups.json"),
    JSON.stringify(labeledSentences, null, 2)
  );

  const sentenceDocumentsRelations = createSentenceDocumentRelations(
    documents,
    labeledSentences,
    documentsRelations
  );

  console.log(
    "sentence documents relations len: ",
    sentenceDocumentsRelations.length
  );

  Fs.writeFileSync(
    Path.resolve("./public/roberta-train-sentence-documents-relations.json"),
    JSON.stringify({ documentRelations: sentenceDocumentsRelations }, null, 2)
  );

  console.timeEnd("main");
}

main();
