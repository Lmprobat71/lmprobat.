<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "lmprobat71@gmail.com";
    $subject = "Nouveau message de contact de $name";
    $body = "Nom: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo "Merci, votre message a été envoyé avec succès.";
    } else {
        echo "Désolé, une erreur est survenue. Veuillez réessayer plus tard.";
    }
} else {
    echo "Méthode de requête non supportée.";
}
?>