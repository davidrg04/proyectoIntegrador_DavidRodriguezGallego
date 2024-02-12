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
    $nombreCarrera = $data['nombre'];
    $query = "SELECT id, id_usuario, nombre, enlaceWeb, reglamento, track, portada, localizacion, fecha, distancia, desnivel, modalidad, sexo FROM carreras WHERE nombre = ?";
    // $query = "SELECT c.id, u.username, c.nombre, c.enlaceWeb, c.reglamento, c.track, c.portada, c.localizacion, c.fecha, c.distancia, c.desnivel, c.modalidad, c.sexo FROM carreras c INNER JOIN usuarios u ON c.id_usuario = u.id WHERE c.nombre = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $nombreCarrera);
    try {
        $stmt->execute();

        $result = $stmt->get_result();

        $carrera = [];
        while ($row = $result->fetch_assoc()) {
            $fecha = $row['fecha'];
            $idCarrera = $row['id'];
            $carrera[] = $row;
        }

        $queryFotos = "SELECT nombreFoto FROM fotos WHERE id_carrera = ?";
        $stmtFotos = $con->prepare($queryFotos);
        $stmtFotos->bind_param("i", $idCarrera);

        $stmtFotos->execute();
        $resultFotos = $stmtFotos->get_result();
        $fotos = [];
        while ($row = $resultFotos->fetch_assoc()) {
            $fotos[] = $row;
        }
        $carrera[] = $fotos;

        $queryCategoria = "SELECT categoria.id, categoria.nombre, premios.primero, premios.segundo,premios.tercero FROM categoria INNER JOIN premios ON categoria.id = premios.id_categoria WHERE categoria.id_carrera = ?";
        $stmtCategoria = $con->prepare($queryCategoria);
        $stmtCategoria->bind_param("i", $idCarrera);
        $stmtCategoria->execute();
        $resultCategoria = $stmtCategoria->get_result();
        $categorias = [];
        while ($row = $resultCategoria->fetch_assoc()) {
            if ($fecha < date('Y-m-d')) {
                $idCategoria = $row['id'];

                $query = "SELECT primero, segundo, tercero, cuarto, quinto FROM clasificacion WHERE id_categoria = ?";
                $stmt = $con->prepare($query);
                $stmt->bind_param("i", $idCategoria);
                $stmt->execute();
                $result = $stmt->get_result();
                $clasificacion = [];

                while ($row2 = $result->fetch_assoc()) {
                    $clasificacion[] = $row2;
                }
                $row['clasificacion'] = $clasificacion;
                $categorias[] = $row;
            }else{
                $categorias[] = $row;
            }
        }
        $carrera[] = $categorias;

        $queryNombreUsuario = "SELECT username FROM usuarios WHERE id = ?";
        $stmtNombreUsuario = $con->prepare($queryNombreUsuario);
        $stmtNombreUsuario->bind_param("i", $carrera[0]['id_usuario']);
        $stmtNombreUsuario->execute();
        $resultNombreUsuario = $stmtNombreUsuario->get_result();
        $nombreUsuario = $resultNombreUsuario->fetch_assoc();
        $carrera[] = $nombreUsuario;
       

        header('Content-Type: application/json');
        header("HTTP/1.1 200 OK");
        echo json_encode($carrera);



    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
    }
}
?>