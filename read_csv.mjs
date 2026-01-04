import { readFile } from 'fs/promises';

async function main() {
    try {
        const content = await readFile('carros cbpa.csv', 'latin1');
        const lines = content.split(/\r?\n/);
        const headers = lines[0].split(';');
        console.log('Headers found:', headers);
        console.log('First row:', lines[1] ? lines[1].split(';') : 'None');
    } catch (e) {
        console.error(e);
    }
}
main();
