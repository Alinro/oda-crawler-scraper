import PageNavigator from "./src/PageNavigator.js";
import ScrapperManager from "./src/ScrapperManager.js";
import config from "./src/config.js";

const pageNavigator = new PageNavigator(false);
const scrapperManager = new ScrapperManager(pageNavigator);

console.log(newProducts);
console.log(nextCategoryPages);
console.log(nextSubcategoryPages);

pageNavigator.close();
// await browser.close();

//
/*

PageNavigator
    - getNextPage

PageInspector
    - getProducts
    - getLinks
    - getNextPage

ScrapperManager
    - visitedPages
    - gatheredProducts
    - pagesToVisit
*/
