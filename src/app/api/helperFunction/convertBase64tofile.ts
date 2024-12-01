import fs from "fs";
import util from "util";
// Promisify the writeFile function from fs module
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const unlinkAsync = util.promisify(fs.unlink);
/**
 * Converts a Base64 encoded string to a file.
 * @param {string} base64Data The Base64 encoded data.
 * @param {string} filename The filename where to save the file.
 * @returns {Promise<void>} A promise that resolves if the file is written successfully.
 */
import getLogger from '~/core/logger';
const logger = getLogger();

async function base64ToFile(base64Data: string, fileName: string) {
    try {
        // Write the Base64 string to a file
        await writeFileAsync(fileName, base64Data, { encoding: 'base64' });
        const fileData = await readFileAsync(fileName);
        return { fileName, fileData };
    } catch (error) {
        logger.error("Error Occurs")
        return null;
    }
}

async function deleteFile(fileName: string) {
    await unlinkAsync(fileName);
    logger.error("File Deleted Successfully")
    return true;
}
// // Example usage:
// base64ToFile('yourBase64StringHere', 'output.png')
//     .then(() => console.log('Conversion successful!'))
//     .catch(error => console.error('Conversion failed:', error));
