import axios from "axios";
import { jsonToTsv } from "../file-generator/json-to-tsv.service";
import { ChaldalTsvOutput } from "../interfaces/chaldal-tsv-output.interface";
import { getBestMatches } from "../data-comparer/data-compare.service";

const PAYLOAD = {
    apiKey: "e964fc2d51064efa97e94db7c64bf3d044279d4ed0ad4bdd9dce89fecc9156f0",
    storeId: 1,
    warehouseId: 8,
    pageSize: 100,
    currentPageIndex: 0,
    metropolitanAreaId: 1,
    query: "chicken egg",
    productVariantId: -1,
    canSeeOutOfStock: "true",
    filters: [],
    maxOutOfStockCount: {
        case: "Some",
        fields: [
            5
        ]
    },
    shouldShowAlternateProductsForAllOutOfStock: {
        case: "Some",
        fields: [
            true
        ]
    },
    customerGuid: {
        case: "None"
    }
}

const apiUrl = `https://catalog.chaldal.com/searchOld`;

const getData = async (pageIndex: number) => {
    PAYLOAD.currentPageIndex = pageIndex
    return axios.post(apiUrl, PAYLOAD);
}

export const scrapeChaldal = async () => {
    const result: unknown[] = [];

    const initialData = (await getData(0)).data;
    const totalPages = initialData.nbPages;

    initialData.hits.forEach((item: unknown) => { result.push(item) });

    if (totalPages > 1) {
        for (let i = 1; i < totalPages; i++) {
            const consecutiveData = (await getData(i)).data;

            consecutiveData.hits.forEach((item: unknown) => { result.push(item) });
        }
    }

    const unfilteredOutput: ChaldalTsvOutput[] = result.map((item: unknown) => {
        return {
            Name: (item as any).name,
            Price: (item as any).price
        }
    });

    const outputFirstInteration = getBestMatches(unfilteredOutput, 'Chicken egg', 10);
    const output = getBestMatches(outputFirstInteration, 'egg', 15);

    jsonToTsv<ChaldalTsvOutput>(output, 'chaldal');
}