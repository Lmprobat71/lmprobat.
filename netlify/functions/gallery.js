const fs = require('fs').promises; // Utiliser les promesses
const path = require('path');

exports.handler = async function(event, context) {
    const service = event.queryStringParameters.service;
    if (!service || !/^[a-zA-Z0-9-_]+$/.test(service)) { // Validation supplémentaire
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Service non spécifié ou invalide.' })
        };
    }

    // Utilisation d'un chemin absolu
    const directory = path.join('/', 'images', 'Galery', service);

    try {
        // Vérifier si le répertoire existe
        await fs.access(directory);
        
        // Lire les fichiers dans le répertoire
        const files = await fs.readdir(directory);
        const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Sensibilité à la casse

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
            body: JSON.stringify({ error: `Répertoire non trouvé ou inaccessible: ${error.message}` }) // Message d'erreur détaillé
        };
    }
};
