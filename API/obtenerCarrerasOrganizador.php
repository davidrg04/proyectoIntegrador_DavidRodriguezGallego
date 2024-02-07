<?php
require_once('./CONEXION/conexionBdd.php');
require '../vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
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

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;


    $query = "SELECT id_usuario, nombre, portada, fecha, localizacion, distancia  FROM carreras where id_usuario = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $id);
    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $carreras = [];
        while ($row = $result->fetch_assoc()) {
            $carreras[] = $row;
        }
        header('Content-Type: application/json');
        header("HTTP/1.1 200 OK");
        echo json_encode($carreras);
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
        exit;
    }
}

?>