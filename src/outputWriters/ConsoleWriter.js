import WriterInterface from "./WriterInterface.js";

export default class ConsoleWriter extends WriterInterface {
  write(elements) {
    if (elements.length === 0) {
      return;
    }

    elements.forEach((element) => {
      let output = "";

      for (const [key, value] of Object.entries(element)) {
        output += `${key}: ${value} | `;
      }

      console.log(output);
    });
  }
}
