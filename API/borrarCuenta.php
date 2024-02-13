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
            header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");         

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
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
            $idsCarreras = [];
            $query = "SELECT id FROM carreras WHERE id_usuario = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("i", $id);
            try {
                $stmt->execute();
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    $idsCarreras[] = $row["id"];
                }

                foreach ($idsCarreras as $idCarrera) {
                    $query = "SELECT id FROM categoria WHERE id_carrera = ?";
                    $stmtCategoriaId = $con->prepare($query);
                    $stmtCategoriaId->bind_param("i", $idCarrera);
                    
                    $stmtCategoriaId->execute();
                    $resultCategoriaId = $stmtCategoriaId->get_result();
                    $idsCategoria = [];
                    while ($rowCategoriaId = $resultCategoriaId->fetch_assoc()) {
                        $idsCategoria[] = $rowCategoriaId["id"];
                    }

                    
                }

            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }


            $query = "DELETE FROM organizador where id_usuario = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("i", $id);
            try {
                $stmt->execute();
                $stmt->store_result();
                if ($stmt->affected_rows > 0) {
                    $query2 = "DELETE FROM usuarios where id = ?";
                    $stmt = $con->prepare($query2);
                    $stmt->bind_param("i", $id);
                    try {
                        $stmt->execute();
                        header("HTTP/1.1 200 OK");
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
                }
            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }
        }else {
            $query3 = "DELETE FROM usuarios where id = ?";
                    $stmt = $con->prepare($query3);
                    $stmt->bind_param("i", $id);
                    try {
                        $stmt->execute();
                        header("HTTP/1.1 200 OK");
                    } catch (mysqli_sql_exception $e) {
                        header("HTTP/1.1 400 Bad Request");
                    }
        }
    }
?>