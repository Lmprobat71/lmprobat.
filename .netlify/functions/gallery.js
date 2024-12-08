const fs = require('fs').promises;
const path = require('path');

exports.handler = async function(event, context) {
    const service = event.queryStringParameters.service;
    if (!service || !/^[a-zA-Z0-9-_]+$/.test(service)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Service non spécifié ou invalide.' })
        };
    }

    // Log du service pour le débogage
    console.log('Service:', service);

    const directory = path.join(__dirname, '..', '..', 'images', 'Galery', service);

    // Log du répertoire pour le débogage
    console.log('Directory:', directory);

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
        // Log de l'erreur pour le débogage
        console.error('Erreur:', error.message);

        return {
            statusCode: 404,
            body: JSON.stringify({ error: `Répertoire non trouvé ou inaccessible: ${error.message}` })
        };
    }
};
