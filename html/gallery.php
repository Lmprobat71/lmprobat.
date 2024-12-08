<?php
if (!isset($_GET['service'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Service non spécifié.']);
    exit;
}

$service = $_GET['service'];
$directory = $_SERVER['DOCUMENT_ROOT'] . '/images/Galery/' . $service . '/';

// Vérifiez si le répertoire existe
if (!is_dir($directory)) {
    http_response_code(404);
    echo json_encode(['error' => 'Répertoire non trouvé.']);
    exit;
}

$images = glob($directory . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

if (!$images) {
    echo json_encode(['error' => 'Aucune image trouvée pour ce service.']);
    exit;
}

// Debugging: Afficher les chemins trouvés
foreach ($images as $image) {
    error_log("Image trouvée : " . $image);
}

// Convertir le chemin absolu en chemin relatif pour le client
$images = array_map(function($image) {
    return str_replace($_SERVER['DOCUMENT_ROOT'], '', $image);
}, $images);

header('Content-Type: application/json');
echo json_encode($images);
?>
