<?php

// Check if the form was submitted using the POST method
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Database Connection Configuration
    $servername = "localhost";
    $username = "your_db_username"; // ❗ Replace with your database username
    $password = "your_db_password"; // ❗ Replace with your database password
    $dbname = "your_db_name";       // ❗ Replace with your database name

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 2. Sanitize and validate the input data
        $fullName = trim($_POST['fullName']);
        $emailAddress = trim($_POST['emailAddress']);
        $subject = trim($_POST['subject']);
        $message = trim($_POST['message']);

        // Basic server-side validation
        if (empty($fullName) || empty($emailAddress) || empty($subject) || empty($message)) {
            header('Location: contact.html?status=error&message=All fields are required.');
            exit;
        }

        if (!filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
            header('Location: contact.html?status=error&message=Invalid email format.');
            exit;
        }

        // 3. Store data in the database
        $sql = "INSERT INTO contact_submissions (full_name, email, subject, message) VALUES (:full_name, :email, :subject, :message)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':email', $emailAddress);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        $stmt->execute();

        // 4. Send email notification (optional but recommended)
        $to = 'hello@goaskillup.org'; // ❗ Replace with your recipient email
        $email_subject = "New SkillConnect Inquiry: " . $subject;
        $email_body = "You have received a new message from the SkillConnect contact form.\n\n" .
                      "Full Name: " . $fullName . "\n" .
                      "Email: " . $emailAddress . "\n" .
                      "Subject: " . $subject . "\n" .
                      "Message:\n" . $message;
        $headers = "From: " . $emailAddress . "\r\n";
        $headers .= "Reply-To: " . $emailAddress . "\r\n";
        mail($to, $email_subject, $email_body, $headers);

        // 5. Redirect with success message
        header('Location: contact.html?status=success&message=Your message has been sent successfully!');
        
    } catch(PDOException $e) {
        // Log the error and redirect with an error message
        error_log("Database or Mailer Error: " . $e->getMessage());
        header('Location: contact.html?status=error&message=Failed to send your message. Please try again later.');
    } finally {
        $conn = null; // Close the database connection
    }

} else {
    header('Location: contact.html');
    exit;
}
?>