const fs = require('fs').promises;
const path = require('path');

// Fonction pour lister les fichiers et dossiers
async function listDirectoryContents(directory) {
    try {
        const files = await fs.readdir(directory, { withFileTypes: true });
        const results = [];
        for (const file of files) {
            const filePath = path.join(directory, file.name);
            const isDirectory = file.isDirectory();
            results.push({ name: file.name, path: filePath, isDirectory });
            // Si c'est un dossier, récurser pour lister son contenu
            if (isDirectory) {
                const subDirContents = await listDirectoryContents(filePath);
                results.push(...subDirContents);
            }
        }
        return results;
    } catch (error) {
        return [{ name: directory, error: error.message }];
    }
}

exports.handler = async function(event, context) {
    const basePath = '/';
    const directoryContents = await listDirectoryContents(basePath);

    return {
        statusCode: 200,
        body: JSON.stringify({ directoryContents })
    };
};
