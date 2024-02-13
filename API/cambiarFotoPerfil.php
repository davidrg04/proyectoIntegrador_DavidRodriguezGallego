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
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;

    $fotoPerfil = $_FILES['fotoPerfil']['name'];

    $query = "SELECT fotoPerfil FROM usuarios WHERE id = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("i", $id);
    try {
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $fotoPerfilAntigua = $row['fotoPerfil'];
        
        unlink("./users/user$id/fotos/".$fotoPerfilAntigua);

        if (!is_dir("./users/user$id/fotos")) {
            mkdir("./users/user$id/fotos", 0755, true);
            
        }
        move_uploaded_file($_FILES["fotoPerfil"]["tmp_name"], "./users/user$id/fotos/" . $fotoPerfil);

        $query = "UPDATE usuarios SET fotoPerfil = ? where id = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("si", $fotoPerfil, $id);
        $stmt->execute();
        
        // header('Content-Type: application/json');
        header("HTTP/1.1 200 No Content");
        // echo json_encode(["fotoPerfil" => $fotoPerfil]);
        
        
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
    }

   
}
?>