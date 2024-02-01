<?php
    require_once('./CONEXION/conexionBdd.php');
    require_once('./jwtGenerator.php');
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
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if($_SERVER["REQUEST_METHOD"] == 'POST'){
        $rol = "normal";
        $username = $data['username'];
        $pass = $data['password'];

        $query = "SELECT id FROM usuarios WHERE username = ? and pass = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("ss",  $username, $pass);

        try{
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows > 0){
                $row = $result->fetch_assoc();
                $id = $row['id'];
                $query2 = "SELECT * FROM organizador WHERE id_usuario = ?";
                $stmt = $con->prepare($query2);
                $stmt->bind_param("i", $id);
                try {
                    $stmt->execute();
                    $result2 = $stmt->get_result();
                    if($result2->num_rows > 0){
                        $rol = "organizer";
                    }
                } catch (mysqli_sql_exception $e) {
                    header("HTTP/1.1 400 Bad Request");
                }

                $jwt = generateJWT($username,$pass, $rol, $id);

                header("HTTP/1.1 200 OK");
                echo json_encode(["message" => "Login correcto", "token" => $jwt, "username" => $username, "rol" =>$rol]);
            } else {
                header("HTTP/1.1 401 Unauthorized");
                echo json_encode("Login incorrecto");
            }

        } catch (mysqli_sql_exception $e){
            header("HTTP/1.1 400 Bad Request");
        }

    }else{
        header("HTTP/1.1 400 Bad Request");
    }
    exit;

?>