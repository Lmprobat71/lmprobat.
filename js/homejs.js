// Utilisation de debouncing pour le défilement
let timeout;
window.addEventListener('scroll', function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const photos = document.querySelectorAll('.photos img');
        photos.forEach(photo => {
            const rect = photo.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                photo.classList.add('visible');
            }
        });
    }, 100); // Ajustez le délai selon vos besoins
});

// Fonction pour charger du contenu HTML dans un élément avec feedback utilisateur
function loadHTML(elementId, url) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<p>Chargement...</p>'; // Indicateur de chargement

    fetch(url)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
        })
        .catch(error => {
            console.error('Erreur de chargement:', error);
            element.innerHTML = '<p>Erreur de chargement. Veuillez réessayer plus tard.</p>';
        });
}

// Fonction pour remplacer le GIF par le PNG
function replaceGifWithPng() {
    document.getElementById('welcome-gif').style.display = 'none';
    document.getElementById('welcome-png').style.display = 'block';
}

// Fonction pour déplacer, tourner, et réduire le PNG
function animatePng() {
    const pngImage = document.getElementById('welcome-png');
    pngImage.classList.add('animate-bottom-right');
}

// Remplacer le GIF par le PNG après 2 secondes
setTimeout(replaceGifWithPng, 2000);

// Animer le PNG après 3 secondes (1 seconde après le remplacement)
setTimeout(animatePng, 3000);

// Charger le menu et le footer une fois le DOM prêt
document.addEventListener('DOMContentLoaded', function() {
    loadHTML('menu-container', '/html/menu.html');
    loadHTML('footer-container', '/html/footer.html');
});

// Ajout d'un slider d'images
let currentSlide = 0;
const slides = document.querySelectorAll('.slider img');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000); // Change de diapositive toutes les 3 secondes
showSlide(currentSlide); // Affiche la première diapositive

// Fonction pour ouvrir/fermer le menu burger et fermer en cliquant ailleurs
function toggleMenu() {
    const menu = document.querySelector("nav ul");
    const burger = document.querySelector(".burger");
    menu.classList.toggle("active");
    burger.classList.toggle("active");
}

// Fermer le menu lorsqu'on clique en dehors
function closeMenuOnClickOutside(event) {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('nav ul');
    if (menu.classList.contains('active') && !burger.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('active');
        burger.classList.remove('active');
    }
}

document.addEventListener('click', closeMenuOnClickOutside);

const burger = document.querySelector('.burger');
burger.addEventListener('click', function(event) {
    event.stopPropagation();
    toggleMenu();
});

// Ajout d'un formulaire de contact dynamique avec gestion des erreurs
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    fetch('/path/to/your/api', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Votre message a été envoyé avec succès!');
        this.reset(); // Réinitialiser le formulaire
    })
    .catch(error => {
        console.error('Erreur d\'envoi du formulaire:', error);
        alert('Une erreur est survenue lors de l\'envoi du message.');
    });
});