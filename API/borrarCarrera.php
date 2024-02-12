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
        header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
$data = json_decode(file_get_contents("php://input"), true);
if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $nombreCarrera = $data['nombreCarrera'];
    $query = "SELECT id FROM carreras WHERE nombre = ?";
    $stmt = $con->prepare($query);
    $stmt->bind_param("s", $nombreCarrera);

    $con->begin_transaction();
    try{
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $idCarrera = $row["id"];

        $query = "SELECT id FROM categoria WHERE id_carrera = ?";
        $stmt2 = $con->prepare($query);
        $stmt2->bind_param("i", $idCarrera);
        
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $idsCategoria = [];
        while ($row2 = $result2->fetch_assoc()) {
            $idsCategoria[] = $row2["id"];
        }
        
        foreach ($idsCategoria as $idCategoria) {
            $queryPremios = "DELETE FROM premios WHERE id_categoria = ?";
            $stmtPremios = $con->prepare($queryPremios);
            $stmtPremios->bind_param("i", $idCategoria);
            $stmtPremios->execute();
    
            $queryClasificacion = "DELETE FROM clasificacion WHERE id_categoria = ?";
            $stmtClasificacion = $con->prepare($queryClasificacion);
            $stmtClasificacion->bind_param("i", $idCategoria);
            $stmtClasificacion->execute();
        }
        
        $queryCategoria = "DELETE FROM categoria WHERE id_carrera = ?";
        $stmtCategoria = $con->prepare($queryCategoria);
        $stmtCategoria->bind_param("i", $idCarrera);
        $stmtCategoria->execute();

        $queryFotos = "DELETE FROM fotos WHERE id_carrera = ?";
        $stmtFotos = $con->prepare($queryFotos);
        $stmtFotos->bind_param("i", $idCarrera);
        $stmtFotos->execute();

        $queryFavoritos = "DELETE FROM favoritos WHERE id_carrera = ?";
        $stmtFavoritos = $con->prepare($queryFavoritos);
        $stmtFavoritos->bind_param("i", $idCarrera);
        $stmtFavoritos->execute();

        $queryCarreras = "DELETE FROM carreras WHERE id = ?";
        $stmtCarreras = $con->prepare($queryCarreras);
        $stmtCarreras->bind_param("i", $idCarrera);
        $stmtCarreras->execute();

        $con->commit();
        header("HTTP/1.1 200 OK");

    }catch (mysqli_sql_exception $e) {
        $con->rollback();
        header("HTTP/1.1 400 Bad Request");
    }
}
?>