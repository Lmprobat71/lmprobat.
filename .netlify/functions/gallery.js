const fs = require('fs').promises;
const path = require('path');

async function checkPermissions(directory) {
    try {
        await fs.access(directory);
        return { path: directory, access: 'authorized' };
    } catch (error) {
        return { path: directory, access: 'denied', error: error.message };
    }
}

async function scanPaths(basePath, service) {
    const directoriesToCheck = [
        basePath,
        path.join(basePath, 'images'),
        path.join(basePath, 'images', 'Galery'),
        path.join(basePath, 'images', 'Galery', service)
    ];

    const results = [];
    for (const dir of directoriesToCheck) {
        results.push(await checkPermissions(dir));
    }
    return results;
}

exports.handler = async function(event, context) {
    const service = event.queryStringParameters.service;
    if (!service || !/^[a-zA-Z0-9-_]+$/.test(service)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Service non spécifié ou invalide.' })
        };
    }

    // Point de départ à la racine du serveur
    const basePath = '/';
    const scanResults = await scanPaths(basePath, service);
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
            body: JSON.stringify({
                scanResults,
                images: images.map(image => `/images/Galery/${service}/${image}`)
            })
        };
    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: `Répertoire non trouvé ou inaccessible: ${error.message}`,
                scanResults
            })
        };
    }
};
