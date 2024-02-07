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
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $key = "proyectoDavid";
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

        list(, $jwt) = explode(' ', $authHeader);
        $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
        $id = $jwtDecoded->id;
        $nombreCarrera = $data['nombreCarrera'];

        $query = "SELECT id FROM carreras WHERE nombre = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $nombreCarrera);
        try {
            $stmt->execute();
            $result = $stmt->get_result();
            $carrera = $result->fetch_assoc();
            $idCarrera = $carrera['id'];

            $añadirFavorito = "SELECT * FROM favoritos where id_usuario = ? AND id_carrera = ?";
            $stmt2 = $con->prepare($añadirFavorito);
            $stmt2->bind_param("ii", $id, $idCarrera);
            $stmt2->execute();
            $stmt2->store_result();
            if ($stmt2->num_rows > 0) {
                header('Content-Type: application/json');
                header("HTTP/1.1 200 OK");
                echo json_encode(["favorito" => "true"]);
                exit;
            }else{
                header('Content-Type: application/json');
                header("HTTP/1.1 200 OK");
                echo json_encode(["favorito" => "false"]);
                exit;
            }
            

        } catch (mysqli_sql_exception $e) {
            header('Content-Type: application/json');
            header("HTTP/1.1 400 Bad Request");
            exit;
        }


    }
?>