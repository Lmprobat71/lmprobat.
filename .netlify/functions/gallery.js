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

    const directory = path.join('/', 'images', 'Galery', service);

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
        return {
            statusCode: 404,
            body: JSON.stringify({ error: `Répertoire non trouvé ou inaccessible: ${error.message}` })
        };
    }
};
