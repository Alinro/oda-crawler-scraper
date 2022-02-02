import CrawlerInterface from "./crawlers/CrawlerInterface.js";
import WriterInterface from "./outputWriters/WriterInterface.js";
import { wait } from "./utils.js";

export default class ScrapingCoordinator {
  /**
   * @var {CrawlerInterface} crawler a reference to a class that implements the CrawlerInterface
   */
  #crawler;

  /**
   * @var {WriterInterface} outputWriter TODO
   */
  #outputWriter;

  /**
   * @var {number} delayTimer how long to wait before processing the next page
   */
  #delayTimer;

  /**
   * @var {object} instructions instructions that describe how to navigate and collect data from a page
   */
  #instructions;

  /**
   * @var {Set} pagesAlreadyVisited a set of pages that we already visited (so we don't visit the same page multiple times)
   */
  #pagesAlreadyVisited = new Set();

  /**
   * @var {Array} pagesToVisit a collection of pages that are going to be visited
   */
  #pagesToVisit = [];

  /**
   *
   * @param {CrawlerInterface} crawler
   * @param {WriterInterface} outputWriter
   * @param {object} instructions
   * @param {number} delayTimer
   */
  constructor(crawler, outputWriter, instructions, delayTimer) {
    this.#crawler = crawler;
    this.#instructions = instructions;
    this.#outputWriter = outputWriter;

    this.#delayTimer = delayTimer;
  }

  /**
   * Starts crawling and scraping
   */
  async start() {
    await this.#processPage(this.#instructions.startAddress, true);

    while (this.#pagesToVisit.length > 0) {
      const nextPage = this.#pagesToVisit.pop();
      if (this.#pagesAlreadyVisited.has(nextPage)) {
        continue;
      }

      await wait(this.#delayTimer);
      await this.#processPage(nextPage);
    }

    await this.#crawler.close();
  }

  /**
   * Processes an address:
   *  - opening
   *  - collects new pages to visit
   *  - collects products
   *
   * @param {string} address
   * @param {boolean} withCategory
   */
  async #processPage(address, withCategory = false) {
    let newPagesToVisit;

    this.#pagesAlreadyVisited.add(address);
    await this.#crawler.gotoAddress(address);

    let { container, metadata } = this.#instructions.item;
    const newProducts = await this.#crawler.getElements(container, metadata);

    if (withCategory) {
      ({ container, metadata } = this.#instructions.category);
      newPagesToVisit = await this.#crawler.getElements(container, metadata);
      newPagesToVisit.forEach((page) => {
        this.#pagesToVisit.push(page.link);
      }, this);
    }

    ({ container, metadata } = this.#instructions.subcategory);
    newPagesToVisit = await this.#crawler.getElements(container, metadata);
    newPagesToVisit.forEach((page) => {
      this.#pagesToVisit.push(page.link);
    }, this);

    this.#outputWriter.write(newProducts);
    // console.log(this.pagesToVisit);
  }
}
