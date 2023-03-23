import { generateVectorModels } from "./src/process.js";
import { createDictionary, createListOfTerms } from "./src/transform.js";

// antes rodar o script com o comando: npm run extract 
console.log("Starting process...");
createListOfTerms();
createDictionary();
generateVectorModels(); // testar pela geração em tempo real a partir dos documentos salvos
process.exit(0);
