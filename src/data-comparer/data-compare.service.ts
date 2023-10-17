import { CommonTsvOutput } from "../interfaces/common-output.interface";

const calculateSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    const editDistance = editDistanceBetweenStrings(str1, str2);
    return 1 - editDistance / maxLength;
};

const editDistanceBetweenStrings = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

export const getBestMatches = (products: CommonTsvOutput[], targetProduct: string, similarityThreshold: number) => {
    const similarityScores = products.map((product) => ({
        name: product.Name,
        similarity: calculateSimilarity(targetProduct, product.Name),
        price: product.Price
    }));

    similarityScores.sort((a, b) => b.similarity - a.similarity);

    const totalProducts = similarityScores.length;
    const threshold = totalProducts * (similarityThreshold / 100);

    const topMatches = similarityScores.slice(0, threshold);

    const result = topMatches.map((match) => {
        return {
            Name: match.name,
            Price: match.price
        }
    });

    return result;
}