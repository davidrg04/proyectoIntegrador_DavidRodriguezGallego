<?php
require_once('./CONEXION/conexionBdd.php');

$con = new Conexion();
if ($con->connect_error) {
    echo "Error de conexión: " . $con->connect_error;
    exit;
}
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $data['username'];
    $query = "SELECT username FROM usuarios WHERE username = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $username);
    try {
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            header('Content-Type: application/json');
            header("HTTP/1.1 200 OK");
            echo json_encode(["existe" => true]);
        } else {
            header('Content-Type: application/json');
            header("HTTP/1.1 200 OK");
            echo json_encode(["existe" => false]);
        }
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
    }
}
?>