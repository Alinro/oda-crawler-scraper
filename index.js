import PuppeteerCrawler from "./src/crawlers/PuppeteerCrawler.js";
import ScrapingCoordinator from "./src/ScrapingCoordinator.js";
import config from "./src/config.js";

const navigator = new PuppeteerCrawler(true);
const scrapingCoordinator = new ScrapingCoordinator(navigator, null, config);
await scrapingCoordinator.start();
