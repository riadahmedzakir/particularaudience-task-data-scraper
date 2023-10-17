import axios from 'axios';
import { jsonToTsv } from '../file-generator/json-to-tsv.service';
import { PickabooTsvOutput } from '../interfaces/pickaboo-tsv-output.interface';
import { getBestMatches } from '../data-comparer/data-compare.service';

const API_KEY = `6W7Z0N7U0T`;
const SEARCH_KEY = `iphone`;
const PAGE_SIZE = 250;

const apiUrl = `https://searchserverapi.com/getresults?api_key=${API_KEY}&q=${SEARCH_KEY}&queryCorrection=true&suggestions=false&maxResults=${PAGE_SIZE}&categories=false&restrictBy\[visibility\]=3|4&restrictBy\[status\]=1&facets=false&restrictBy\[category_ids\]=&startIndex=`;

const getData = async (pageIndex: number) => {
    const url = apiUrl + pageIndex;
    return axios.get(url);
}

export const scrapePickaboo = async () => {
    const result: unknown[] = [];

    const initialData = (await getData(0)).data;
    const totalItems = initialData.totalItems;

    initialData.items.forEach((item: unknown) => { result.push(item) });

    if (totalItems > PAGE_SIZE) {
        const numberOfCallsRequired = Math.ceil(totalItems / PAGE_SIZE) - 1;
        console.log(numberOfCallsRequired);

        for (let i = 1; i <= numberOfCallsRequired; i++) {
            const consecutiveData = (await getData(i)).data;

            consecutiveData.items.forEach((item: unknown) => { result.push(item) });
        }
    }

    const unfilteredOutput: PickabooTsvOutput[] = result.map((item: unknown) => {
        return {
            Name: (item as any).title,
            Price: (item as any).price
        }
    });

    const output = getBestMatches(unfilteredOutput, 'iPhone 14 pro', 10);

    jsonToTsv<PickabooTsvOutput>(output, 'pickaboo');
}