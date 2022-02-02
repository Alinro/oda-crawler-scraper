import puppeteer from "puppeteer";
import CrawlerInterface from "./CrawlerInterface.js";

export default class PageNavigator extends CrawlerInterface {
  headless;
  browser = null;
  page = null;

  constructor(headless = true) {
    super();

    this.headless = headless;
  }

  async gotoAddress(address) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: this.headless,
        // devtools: true,
      });
    }

    // if (newTab && this.page) {
    //   this.page.close();
    // }

    if (!this.page) {
      this.page = await this.browser.newPage();
    }

    await this.page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await this.page.goto(address);
  }

  async getElements(containerConfig, metadataConfig) {
    // this.page.exposeFunction("nothing", () => null);

    return this.page.evaluate(
      (containerConfig, metadataConfig) => {
        debugger;
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

  async close() {
    this.page.close();
    this.browser.close();
  }
}
