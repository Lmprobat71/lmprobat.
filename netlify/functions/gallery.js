const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const service = event.queryStringParameters.service;
  if (!service) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Service non spécifié.' })
    };
  }

  const directory = path.join(__dirname, '..', '..', 'public', 'images', 'Galery', service);
  if (!fs.existsSync(directory)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Répertoire non trouvé.' })
    };
  }

  const images = fs.readdirSync(directory).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
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
};
