<?php
session_start();
header('Content-Type: application/json'); // For AJAX requests

require 'db.php'; // MySQL connection

// === Helper Function ===
function respond($status, $message, $redirect = null) {
    echo json_encode(['status' => $status, 'message' => $message, 'redirect' => $redirect]);
    exit();
}

// === GOOGLE LOGIN ===
require 'vendor/autoload.php';

$client = new Google_Client();
$client->setClientId("YOUR_GOOGLE_CLIENT_ID");
$client->setClientSecret("YOUR_GOOGLE_CLIENT_SECRET");
$client->setRedirectUri("http://yourdomain.com/auth.php?google=callback");
$client->addScope("email");
$client->addScope("profile");

// Handle Google OAuth callback
if (isset($_GET['google']) && $_GET['google'] === 'callback' && isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    if (!isset($token['error'])) {
        $client->setAccessToken($token['access_token']);
        $oauth = new Google_Service_Oauth2($client);
        $googleUser = $oauth->userinfo->get();

        $googleId = $googleUser->id;
        $name = $googleUser->name;
        $email = $googleUser->email;

        // Check if user exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id);
            $stmt->fetch();
        } else {
            // Insert new user
            $stmtInsert = $conn->prepare("INSERT INTO users (full_name, email, google_id) VALUES (?, ?, ?)");
            $stmtInsert->bind_param("sss", $name, $email, $googleId);
            $stmtInsert->execute();
            $id = $stmtInsert->insert_id;
            $stmtInsert->close();
        }

        $_SESSION['user_id'] = $id;
        $_SESSION['user_name'] = $name;

        header("Location: index.html"); // Redirect to homepage
        exit();
    } else {
        die('Google login failed.');
    }
}

// === SIGNUP ===
if (isset($_POST['action']) && $_POST['action'] === 'signup') {
    $name = trim($_POST['signup-name'] ?? '');
    $email = trim($_POST['signup-email'] ?? '');
    $password = trim($_POST['signup-password'] ?? '');

    if (!$name || !$email || !$password) respond('error', 'All fields are required.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond('error', 'Invalid email.');
    if (strlen($password) < 8) respond('error', 'Password must be at least 8 characters.');

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);

    if ($stmt->execute()) {
        $_SESSION['user_id'] = $stmt->insert_id;
        $_SESSION['user_name'] = $name;
        respond('success', 'Signup successful!', 'index.html');
    } else {
        respond('error', 'Email already registered.');
    }
    $stmt->close();
    $conn->close();
}

// === LOGIN ===
if (isset($_POST['action']) && $_POST['action'] === 'login') {
    $email = trim($_POST['login-email'] ?? '');
    $password = trim($_POST['login-password'] ?? '');

    if (!$email || !$password) respond('error', 'All fields are required.');

    $stmt = $conn->prepare("SELECT id, full_name, password FROM users WHERE email=?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $name, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['user_name'] = $name;
            respond('success', 'Login successful!', 'index.html');
        } else {
            respond('error', 'Incorrect password.');
        }
    } else {
        respond('error', 'Email not registered.');
    }

    $stmt->close();
    $conn->close();
}
