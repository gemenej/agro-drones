import fs from 'fs';

const logs = fs.createWriteStream('logs.txt', { flags: 'a' });
const errors = fs.createWriteStream('errors.txt', { flags: 'a' });

export const logInfo = (message) => {
    logs.write(`\nINFO: ${ new Date().toISOString() } : ${message}`);
};

export const logError = (message) => {
    errors.write(`\nERROR: ${ new Date().toISOString() } : ${message}`);
};


