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
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PATCH");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

 

 if ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;

    $data = json_decode(file_get_contents("php://input"), true);
    $tipo = $data["tipo"];
    $nuevoParametro = $data["parametro"];

    echo($tipo);

    switch ($tipo) {
        case 'username':
            $query = "SELECT username FROM usuarios WHERE username = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("s", $nuevoParametro);
            try {
                $stmt->execute();
                $stmt->store_result();
                if ($stmt->num_rows > 0) {
                    header('Content-Type: application/json');
                    header("HTTP/1.1 409 Conflict");
                    echo json_encode(["error" => "username"]);
                    exit;
                }else {
                    try {
                        $query = "UPDATE usuarios SET username = ? where id = ?";
                        $stmt = $con->prepare($query);
                        $stmt->bind_param("si", $nuevoParametro,$id);
                        $stmt->execute();
                    
                        header("HTTP/1.1 204 No Content");
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                }
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
            break;
        case 'password':
            $query = "UPDATE usuarios SET pass = ? where id = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("si", $nuevoParametro,$id);

            try {
                $stmt->execute();
                header("HTTP/1.1 204 No Content");
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
            break;
        case 'poblacion':
            echo("ENTRE");
            $query = "UPDATE usuarios SET poblacion = ? where id = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("si", $nuevoParametro,$id);

            try {
                $stmt->execute();
                header("HTTP/1.1 204 No Content");
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
            break;
        case 'fotoPerfil':
            
            break;
        case 'telefono':
            $query = "SELECT telefono FROM organizador WHERE telefono = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("s", $nuevoParametro);
            try {
                $stmt->execute();
                $stmt->store_result();
                if ($stmt->num_rows > 0) {
                    header('Content-Type: application/json');
                    header("HTTP/1.1 409 Conflict");
                    echo json_encode(["error" => "telefono"]);
                    exit;
                }else {
                    try {
                        $query = "UPDATE organizador SET telefono = ? where id_usuario = ?";
                        $stmt = $con->prepare($query);
                        $stmt->bind_param("si", $nuevoParametro,$id);
                        $stmt->execute();
                    
                        header("HTTP/1.1 204 No Content");
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                }
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
            break;
        case 'nombreOrg':
            $query = "UPDATE organizador SET nombreOrg = ? where id_usuario = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("si", $nuevoParametro,$id);
            try {
                $stmt->execute();
                header("HTTP/1.1 204 No Content");
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
            break;
        default:
            break;
    }


 }
?>
