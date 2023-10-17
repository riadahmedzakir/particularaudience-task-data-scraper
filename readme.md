# Task
Create a data scraper that scrapes data from multiple ecommerce site which will get the specified item.

## What has been done

The data scraper scrapes data from pickaboo and chaldal. Instead of scraping html and getting details from details page, the application uses respective sites API's to get data chunk by chunk. 

- Each site has it's own scraper.
- Each scaper uses the common file-generator service (Generic type so any file scraper can use it) to generate tsv file for the final result.
- The search result from ecommerce site usually has noise in it. So the unfiltered data set is then processed using Levenshtein distance algorithm, only matching the search term with names with a weighted value. In some cases multiple interation is required as string similarity might not be the way to group this kind of data.

## What has not been done
A few thing i would have liked to have done is

- The search term is hardcoded, would have been nice to put a feature to use user input. Unless scraping is done reguarly that might be wasted effort.
- Pickaboo and Chaldal doesn't have any common items, so didn't implment a way to match between product from this two site and get the best price for the product. 
- Why not another site that has similar product, because this two site has API that was the most stright forward to use. But it would be easy enough to get another scraper, get data that may or may not have API, put it though the same process in the future to get that thing done easily.
- A lot of null checker/ guard clause could have been checked, but since scraping isn't a client facing task, the application has been tested with happy path.


### How to run
Run npm installl or npm i in the command line and use the desired command. There are two script in package.json and is as follows

 - npm start (for development with hot reload)
 - npm run scrape (to get the outputs)