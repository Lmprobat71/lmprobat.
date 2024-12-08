$(document).ready(function () {
    // Afficher l'overlay
    $(".btn-box").click(function () {
        const overlay = $(this).parent().children(".overlay");
        if (overlay.length) {
            overlay.show();
        }
    });

    // Cacher l'overlay
    $(".close").click(function () {
        const overlay = $(this).closest(".overlay");
        if (overlay.length) {
            overlay.hide();
        }
    });

    // Filtrage des images
    $(".list").click(function () {
        const value = $(this).attr('data-filter');
        if (value == 'all') {
            $(".project-image").show('1000');
        } else {
            $(".project-image").not('.' + value).hide('1000');
            $(".project-image").filter('.' + value).show('1000');
        }
    });

    // Mise en surbrillance de l'élément actif
    $(".list").click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    // Charger les images dynamiquement
    window.loadGallery = function (service) {
        const galleryTitle = $("#gallery-title");
        const galleryContent = $("#gallery-content");
        const gallerySection = $("#gallery-section");

        galleryContent.empty(); // Effacer les images précédentes
        galleryTitle.text(`${service}`); // Mettre à jour le titre de la galerie

        fetch(`/html/gallery.php?service=${service}`)
            .then(response => response.json())
            .then(images => {
                if (images.error) {
                    console.error(images.error);
                    return;
                }

                images.forEach(image => {
                    const imgElement = document.createElement("img");
                    imgElement.className = "project-image";
                    imgElement.src = image.replace('\/', '/');
                    galleryContent.append(imgElement);
                });

                if (gallerySection.length) {
                    gallerySection.show(); // Afficher la section galerie
                    $('html, body').animate({
                        scrollTop: gallerySection.offset().top
                    }, 'slow'); // Faire défiler vers la galerie
                }
            })
            .catch(error => {
                console.error('Erreur lors du chargement des images:', error);
            });
    };

    // Fonction pour cacher la galerie
    window.hideGallery = function () {
        const gallerySection = $("#gallery-section");
        if (gallerySection.length) {
            gallerySection.hide();
            $('html, body').animate({
                scrollTop: $("#services").offset().top
            }, 'slow'); // Faire défiler vers la section des services
        }
    };
});
