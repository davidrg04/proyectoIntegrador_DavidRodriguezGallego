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

//  $data = json_decode(file_get_contents("php://input"), true);

 if ($_SERVER["REQUEST_METHOD"] == 'GET') {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    // $headers = getallheaders();
    // $jwt = $headers["Authorization"];

    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;
    $rol = $jwtDecoded->rol;

    if ($rol == "organizer") {
        $query = "SELECT u.id, u.fotoPerfil, u.username, u.poblacion, o.telefono, o.nombreOrg FROM usuarios u LEFT JOIN organizador o ON u.id = o.id_usuario WHERE u.id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $id);
        try {
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            header("HTTP/1.1 200 OK");

            echo json_encode($row);

        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 400 Bad Request");
        }
    }else{
        $query = "SELECT id, fotoPerfil, username, poblacion FROM usuarios WHERE id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("i", $id);
        try {
            $stmt->execute();
            $result = $stmt->get_result();
            $row = $result->fetch_assoc();

            header("HTTP/1.1 200 OK");

            echo json_encode($row);

        } catch (mysqli_sql_exception $e) {
            header("HTTP/1.1 400 Bad Request");
        }
    }
    




 }
?>