import { readFileSync } from 'node:fs';
import { Blob } from 'node:buffer';

export function fileToBlob(filePath: string): Blob {
    const buffer = readFileSync(filePath);
    return new Blob([buffer]);
}
