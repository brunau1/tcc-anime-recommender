import animes from "../public/animes.json" assert { type: "json" };
import animesWithCover from "../public/anime_cover_uris.json" assert { type: "json" };
import Fs from "fs";
import Path from "path";
import { stringSimilarity } from "string-similarity-js";

console.log(animes.names.length, animes.content.length);

const clearText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^a-z ]+/g, " ")
    .replace("second season", "")
    .replace("third season", "")
    .replace("the animation", "")
    .replace("the movie", "")
    .replace("season", "")
    .trim();
};

const realTitles = animes.names.map((title = "") => clearText(title));

console.log(realTitles.length, realTitles[0]);

const titlesToCompare = animesWithCover.map((anime) => {
  return {
    title: clearText(String(anime.title)),
    url: String(anime.url),
  };
});

console.log(titlesToCompare.length, titlesToCompare[0]);

function getMostSimilarTitleId(title, titleCollection) {
  const similarities = [];

  for (let i = 0; i < titleCollection.length; i++) {
    const titleToCompare = titleCollection[i];

    const similarity = stringSimilarity(title, titleToCompare, 4);

    const includesName = titleToCompare.includes(title.split(" ")[0]);

    const ableToInclude = similarity >= 0.5 && includesName;

    if (ableToInclude) {
      similarities.push({ idx: i, title: titleToCompare, sim: similarity });
    }
  }
//   console.log(similarities.length);

  return similarities.sort((a, b) => b.sim - a.sim)[0];
}

function main() {
  const titlesIdsWithCover = [];

  for (let i = 0; i < titlesToCompare.length; i++) {
    console.log(i);

    const titleToCompare = titlesToCompare[i];

    const { title: animeTitle, url } = titleToCompare;

    const mostSimilar = getMostSimilarTitleId(animeTitle, realTitles);

    if (!mostSimilar) continue;

    const { idx, title } = mostSimilar;

    // console.log(idx, " - ", title, " compared to ", animeTitle);

    titlesIdsWithCover.push({ idx, url });
  }

  console.log("titlesIdsWithCover len: ", titlesIdsWithCover.length);
  console.log(titlesIdsWithCover[0]);

  const orderedUrls = [];

  for (let i = 0; i < animes.names.length; i++) {
    console.log(i);
    
    const found = titlesIdsWithCover.find((t) => t.idx === i);

    const url = found ? found.url : "no_cover";

    orderedUrls.push(url);
  }

  console.log("orderedUrls len: ", orderedUrls.length);
  console.log(orderedUrls[0]);

  const animeContentToSave = {
    names: animes.names,
    content: animes.content,
    coverUrls: orderedUrls,
  };

  Fs.writeFileSync(
    "./public/animes_with_cover.json",
    JSON.stringify(animeContentToSave, null, 2)
  );
}

main();
