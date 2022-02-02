import CrawlerInterface from "./crawlers/CrawlerInterface.js";
import { wait } from "./utils.js";

export default class ScrapingCoordinator {
  navigator;
  outputWriter;
  delayTimer;
  config;
  pagesAlreadyVisited = new Set();
  pagesToVisit = [];

  /**
   *
   * @param {CrawlerInterface} navigator
   * @param {*} outputWriter
   * @param {*} config
   * @param {number} delayTimer
   */
  constructor(navigator, outputWriter, config, delayTimer = 2000) {
    this.navigator = navigator;
    this.config = config;
    this.outputWriter = outputWriter;

    this.delayTimer = delayTimer;
  }

  async start() {
    await this.processPage(this.config.startAddress, true);

    while (this.pagesToVisit.length > 0) {
      const nextPage = this.pagesToVisit.pop();
      if (this.pagesAlreadyVisited.has(nextPage)) {
        continue;
      }

      await wait(this.delayTimer);
      await this.processPage(nextPage);
    }

    await this.navigator.close();
  }

  async processPage(address, withCategory = false) {
    let newPagesToVisit;

    this.pagesAlreadyVisited.add(address);
    await this.navigator.gotoAddress(address);

    let { container, metadata } = this.config.item;
    const newProducts = await this.navigator.getElements(container, metadata);

    if (withCategory) {
      ({ container, metadata } = this.config.category);
      newPagesToVisit = await this.navigator.getElements(container, metadata);
      newPagesToVisit.forEach((page) => {
        this.pagesToVisit.push(page.link);
      }, this);
    }

    ({ container, metadata } = this.config.subcategory);
    newPagesToVisit = await this.navigator.getElements(container, metadata);
    newPagesToVisit.forEach((page) => {
      this.pagesToVisit.push(page.link);
    }, this);

    // console.log(newProducts);
    // console.log(this.pagesToVisit);
  }
}
