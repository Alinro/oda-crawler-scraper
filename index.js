import PuppeteerCrawler from "./src/crawlers/PuppeteerCrawler.js";
import ScrapingCoordinator from "./src/ScrapingCoordinator.js";
import ConsoleWriter from "./src/outputWriters/ConsoleWriter.js";
import { getInstructions } from "./instructions/index.js";
import config from "config";

const instructions = getInstructions("oda");

const crawler = new PuppeteerCrawler(config.puppeteer);
const outputWriter = new ConsoleWriter();

const scrapingCoordinator = new ScrapingCoordinator(
  crawler,
  outputWriter,
  instructions,
  config.delay
);

await scrapingCoordinator.start();
