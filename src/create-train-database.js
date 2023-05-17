import Fs from "fs";
import trainSet from "../public/train_large_v2.json" assert { type: "json" };
import animeSet from "../public/animes.json" assert { type: "json" };

const queryResultsRelations = [];

for (const animeQueriesAndRelatedDocs of trainSet) {
  const { queries = [], documents = [] } = animeQueriesAndRelatedDocs;

  queries.map((query) => {
    console.log("query: ", query);

    documents.map((doc) => {
      const text = animeSet.content[doc]
        .toLowerCase()
        .replace(/[^a-z ]+/g, " ");
      // not add if the total length of words in document is less than 40
      if (text.split(" ").length < 40) return;

      queryResultsRelations.push([query, doc, 1]);
    });
    // generate 3 random indexes between 0 and 15000 and verify if index not in documents
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * 15170);
      const text = animeSet.content[randomIndex]
        .toLowerCase()
        .replace(/[^a-z ]+/g, " ");

      if (!documents.includes(randomIndex) && text.split(" ").length > 40) {
        // save the index
        queryResultsRelations.push([query, randomIndex, 0]);
      }
    }
  });
  documents.map((doc) => {
    const text = animeSet.content[doc].toLowerCase().replace(/[^a-z ]+/g, " ");

    // not add if the total length of words in document is less than 40
    if (text.split(" ").length < 40) return;
    // split the entire text into portions of at max 20 words each
    const sentLength = 20;

    const maxSentences = Math.floor(text.split(" ").length / sentLength);

    const currTextSplited = text.split(" ");
    for (let i = 0; i < maxSentences; i++) {
      const sentence = currTextSplited.splice(0, sentLength).join(" ");

      console.log("generated sentence: ", sentence);

      queryResultsRelations.push([sentence, doc, 1]);

      const randomDoc = Math.floor(Math.random() * 15170);

      if (!documents.includes(randomDoc))
        queryResultsRelations.push([sentence, randomDoc, 0]);
    }

    // same number of sentences as the previous step
    for (let i = 0; i < maxSentences; i++) {
      const currText = text.split(" ");

      const otherRandomIndex = Math.floor(Math.random() * currText.length);
      const randomPortionLong =
        otherRandomIndex + 40 > currText.length
          ? currText.slice(otherRandomIndex)
          : currText.slice(otherRandomIndex, otherRandomIndex + 40);

      console.log("random Portion long: ", randomPortionLong.join(" "), "\n");
      // save the index

      const randomIndex = Math.floor(Math.random() * currText.length);
      const randomPortionShort =
        randomIndex + 16 > currText.length
          ? currText.slice(randomIndex)
          : currText.slice(randomIndex, randomIndex + 16);

      console.log("random Portion short: ", randomPortionShort.join(" "), "\n");

      if (randomPortionLong.length >= 30) {
        queryResultsRelations.push([randomPortionLong.join(" "), doc, 1]);

        const randomDoc = Math.floor(Math.random() * 15170);

        if (!documents.includes(randomDoc))
          queryResultsRelations.push([
            randomPortionLong.join(" "),
            randomDoc,
            0,
          ]);
      }

      // if (randomPortionShort.length >= 15) {
      //   queryResultsRelations.push([randomPortionShort.join(" "), doc, 1]);

      //   const randomDoc = Math.floor(Math.random() * 15170);

      //   if (!documents.includes(randomDoc))
      //     queryResultsRelations.push([
      //       randomPortionShort.join(" "),
      //       randomDoc,
      //       0,
      //     ]);
      // }
    }
  });
}

console.log("queryResultsRelations: ", queryResultsRelations.length);

console.log("queryResultsRelations: ", queryResultsRelations[0]);

const version = "V5";

Fs.writeFileSync(
  `./public/train_dataset_${version}.json`,
  JSON.stringify(queryResultsRelations)
);
