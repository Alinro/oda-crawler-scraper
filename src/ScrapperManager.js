import { wait } from "./utils";

export default class ScrapperManager {
  pageNavigator;
  outputWriter;
  delayTimer;
  pagesAlreadyVisited = new Set();
  pagesToVisit = new Set();

  constructor(pageNavigator, outputWriter, delayTimer = 5000) {
    this.pageNavigator = pageNavigator;
    this.outputWriter = outputWriter;

    this.delayTimer = delayTimer;
  }

  async start() {
    this.processPage(config.startAddress, true);

    while (pagesToVisit.length > 0) {
      const nextPage = pagesToVisit.pop();
      if (this.pagesAlreadyVisited.has(nextPage)) {
        continue;
      }

      await wait(this.delayTimer);
      await this.processPage();
    }

    this.pageNavigator.close();
  }

  async processPage(address, withCategory = false) {
    let newPagesToVisit;

    this.pagesAlreadyVisited.add(address);
    this.pageNavigator.gotoAddress(page);

    let { container, metadata } = config.item;
    const newProducts = await this.pageNavigator.getElements(
      container,
      metadata
    );

    if (withCategory) {
      ({ container, metadata } = config.category);
      newPagesToVisit = await this.pageNavigator.getElements(
        container,
        metadata
      );
      newPagesToVisit.forEach((page) => {
        this.pagesToVisit.add(page);
      }, this);
    }

    ({ container, metadata } = config.subcategory);
    newPagesToVisit = await this.pageNavigator.getElements(container, metadata);
    newPagesToVisit.forEach((page) => {
      this.pagesToVisit.add(page);
    }, this);
  }
}
