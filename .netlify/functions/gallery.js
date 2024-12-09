const fs = require('fs').promises;
const path = require('path');

// Fonction pour lister les fichiers et dossiers
async function listDirectoryContents(directory) {
    try {
        console.log(`Listing directory contents for: ${directory}`); // Ajout de log
        const files = await fs.readdir(directory, { withFileTypes: true });
        const results = [];
        for (const file of files) {
            const filePath = path.join(directory, file.name);
            const isDirectory = file.isDirectory();
            results.push({ name: file.name, path: filePath, isDirectory });
            if (isDirectory) {
                const subDirContents = await listDirectoryContents(filePath);
                results.push(...subDirContents);
            }
        }
        return results;
    } catch (error) {
        console.error(`Erreur lors de la lecture du répertoire ${directory}:`, error); // Ajout de log d'erreur
        return [{ name: directory, error: error.message }];
    }
}

exports.handler = async function(event, context) {
    const serviceName = event.queryStringParameters.serviceName || 'default_service';
    const basePath = path.join(__dirname, `../../images/Galery/${serviceName}`);
    console.log('Base Path:', basePath); // Ajout de log pour vérifier le chemin de base

    try {
        const directoryContents = await listDirectoryContents(basePath);
        return {
            statusCode: 200,
            body: JSON.stringify({ directoryContents })
        };
    } catch (error) {
        console.error('Erreur lors de la génération de la réponse:', error); // Ajout de log d'erreur
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};