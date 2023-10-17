import * as fs from 'fs-extra';

const parser = <T extends Record<string, string | number>>(jsonData: T[]): string => {
    const headers = Object.keys(jsonData[0]);
    const headerRow = headers.join('\t');
    const bodyRows = jsonData.map((row) => headers.map((header) => row[header]).join('\t'));

    return [headerRow, ...bodyRows].join('\n');
}

export const jsonToTsv = <T>(jsonData: T[], fileName: string): void => {
    try {
        const tsv = parser(jsonData as any);
        const filePath = `outputs/${fileName}.tsv`;

        fs.outputFileSync(filePath, tsv, 'utf8');
        console.log('TSV file saved as', filePath);
    }
    catch (error) {
        console.error('Error:', error);
    }
}