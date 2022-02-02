import PuppeteerCrawler from "./src/crawlers/PuppeteerCrawler.js";
import ScrapingCoordinator from "./src/ScrapingCoordinator.js";
import { getInstructions } from "./instructions/index.js";
import config from "config";

const instructions = getInstructions("oda");

const crawler = new PuppeteerCrawler(config.puppeteer);

const scrapingCoordinator = new ScrapingCoordinator(
  crawler,
  null,
  instructions
);

await scrapingCoordinator.start();
