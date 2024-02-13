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
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}


$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $idCategoria = $data['idCategoria'];
    $primero = $data['primero'];
    $segundo = $data['segundo'];
    $tercero = $data['tercero'];
    $cuarto = $data['cuarto'];
    $quinto = $data['quinto'];

    $query = "UPDATE clasificacion SET primero = ?, segundo = ?, tercero = ?, cuarto = ?, quinto = ? WHERE id_categoria = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("sssssi", $primero, $segundo, $tercero, $cuarto, $quinto, $idCategoria);
    try {
        $stmt->execute();
        header("HTTP/1.1 204 No Content");
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
        exit;
    }

}
?>