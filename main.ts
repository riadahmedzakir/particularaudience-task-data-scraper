import { scrapeChaldal } from "./src/scrapers/chaldal.scrapper";
import { scrapePickaboo } from "./src/scrapers/pickaboo.scrapper";

const main = async () => {
    await scrapePickaboo();
    await scrapeChaldal();
}

main();