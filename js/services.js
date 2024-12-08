// Charger les images dynamiquement
window.loadGallery = function (service) {
    const galleryTitle = $("#gallery-title");
    const galleryContent = $("#gallery-content");
    const gallerySection = $("#gallery-section");
    if (galleryContent.length && galleryTitle.length && gallerySection.length) {
        galleryContent.empty(); // Effacer les images précédentes
        galleryTitle.text(service); // Mettre à jour le titre de la galerie
        fetch(`/.netlify/functions/gallery?service=${service}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(images => {
                if (images.error) {
                    console.error(images.error);
                    // Afficher un message d'erreur à l'utilisateur
                    galleryContent.append("<p>Erreur lors du chargement des images.</p>");
                    return;
                }
                if (images.length === 0) {
                    galleryContent.append("<p>Aucune image trouvée.</p>");
                    return;
                }
                images.forEach(image => {
                    const imgElement = document.createElement("img");
                    imgElement.className = "project-image";
                    imgElement.src = image.replace('\/', '/');
                    galleryContent.append(imgElement);
                });
                gallerySection.show(); // Afficher la section galerie
                $('html, body').animate({
                    scrollTop: gallerySection.offset().top
                }, 'slow'); // Faire défiler vers la galerie
            })
            .catch(error => {
                console.error('Erreur lors du chargement des images:', error);
                // Afficher un message d'erreur à l'utilisateur
                galleryContent.append("<p>Erreur lors du chargement des images.</p>");
            });
    } else {
        console.error("Un ou plusieurs éléments de la galerie n'ont pas été trouvés.");
    }
};