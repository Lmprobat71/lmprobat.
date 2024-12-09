const fs = require('fs').promises;
const path = require('path');

// Fonction pour lister les répertoires à la racine
async function listRootDirectories() {
    const rootDir = path.resolve(__dirname, '../../');
    try {
        const items = await fs.readdir(rootDir, { withFileTypes: true });
        const directories = items.filter(item => item.isDirectory()).map(item => item.name);
        return directories;
    } catch (error) {
        console.error(`Erreur lors de la lecture du répertoire racine: ${rootDir}`, error);
        throw new Error(`Erreur lors de la lecture du répertoire racine: ${error.message}`);
    }
}

exports.handler = async function(event, context) {
    try {
        const directories = await listRootDirectories();
        return {
            statusCode: 200,
            body: JSON.stringify({ directories })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};