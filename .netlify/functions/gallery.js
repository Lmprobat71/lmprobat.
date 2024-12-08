const fs = require('fs').promises;
const path = require('path');

// Fonction pour vérifier les permissions d'un chemin
async function checkPermissions(directory) {
    try {
        await fs.access(directory);
        console.log(`Accès autorisé pour : ${directory}`);
    } catch (error) {
        console.log(`Accès refusé ou répertoire non trouvé pour : ${directory}`);
    }
}

// Fonction pour scanner les chemins et vérifier les autorisations
async function scanPaths(basePath, service) {
    const directoriesToCheck = [
        path.join(basePath),
        path.join(basePath, 'images'),
        path.join(basePath, 'images', 'Galery'),
        path.join(basePath, 'images', 'Galery', service)
    ];

    for (const dir of directoriesToCheck) {
        await checkPermissions(dir);
    }
}

exports.handler = async function(event, context) {
    const service = event.queryStringParameters.service;
    if (!service || !/^[a-zA-Z0-9-_]+$/.test(service)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Service non spécifié ou invalide.' })
        };
    }

    const basePath = path.join(__dirname, '..', '..');
    await scanPaths(basePath, service);

    const directory = path.join(basePath, 'images', 'Galery', service);

    try {
        await fs.access(directory);
        const files = await fs.readdir(directory);
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        if (!images.length) {
            return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Aucune image trouvée pour ce service.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(images.map(image => `/images/Galery/${service}/${image}`))
        };
    } catch (error) {
        console.error('Erreur:', error.message);

        return {
            statusCode: 404,
            body: JSON.stringify({ error: `Répertoire non trouvé ou inaccessible: ${error.message}` })
        };
    }
};
