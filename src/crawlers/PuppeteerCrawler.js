import puppeteer from "puppeteer";
import CrawlerInterface from "./CrawlerInterface.js";

export default class PuppeteerCrawler extends CrawlerInterface {
  /**
   * @param {object} options a set of options that is passed to puppeteer during launch
   */
  #options;

  /**
   * @param {puppeteer.Browser} browser a reference to the browser instance that puppeteer launched
   */
  #browser;

  /**
   * @param {puppeteer.Page} page a reference to the page tab inside the browser controlled by puppeteer
   */
  #page;

  /**
   *
   * @param {object} options
   */
  constructor(options) {
    super();

    this.#options = options;
  }

  /**
   * Navigate to the specified address in the current tab
   *
   * @param {string} address
   */
  async gotoAddress(address) {
    if (!this.#browser) {
      this.#browser = await puppeteer.launch(this.#options);
    }

    if (!this.#page) {
      this.#page = await this.#browser.newPage();
    }

    await this.#page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await this.#page.goto(address);
  }

  /**
   * Collects the specified elements from the current page
   *
   * @param {object} containerConfig Contains details about identifying the containers
   * @param {object} metadataConfig Contains details about identifying the elements belonging to the container
   * @returns
   */
  async getElements(containerConfig, metadataConfig) {
    // workaround to force puppeteer to populate the source map so we can debug our code in the browser
    // this.page.exposeFunction("nothing", () => null);

    return this.#page.evaluate(
      (containerConfig, metadataConfig) => {
        // debugger;

        const containers = document.querySelectorAll(containerConfig.selector);

        const metadata = [];

        containers.forEach((container) => {
          const element = {};

          for (const [key, { property, selector }] of Object.entries(
            metadataConfig
          )) {
            if (selector) {
              element[key] = container.querySelector(selector)[property];
            } else {
              element[key] = container[property];
            }
          }

          metadata.push(element);
        });

        return metadata;
      },
      containerConfig,
      metadataConfig
    );
  }

  /**
   * Stops puppeteer by closing the page and the browser
   */
  async close() {
    this.#page.close();
    this.#browser.close();
  }
}
