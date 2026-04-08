<?php
if (isset($_GET['username']) && isset($_GET['password'])) {
    $user = $_GET['username'];
    $pass = $_GET['password'];

    echo "Usuario: " . $user . "<br>";
    echo "Password: " . $pass;
}
?>