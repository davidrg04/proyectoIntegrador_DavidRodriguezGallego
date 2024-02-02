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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;


    $nombreCarrera = $_POST['nombre'];
    $fechaCarrera = $_POST['fecha'];
    $localizacion = $_POST['localizacion'];
    $enlaceWeb = $_POST['web'];
    $distancia = $_POST['distancia'];
    $desnivel = $_POST['desnivel'];
    $coordenadas = $_POST['coordenadas'];
    $portada = uniqid() . '-' . $_FILES['portada']['name'];
    $reglamento = uniqid() . '-' . $_FILES['reglamento']['name'];
    
    if (!is_dir("./users/user$id/carreras")) {
        mkdir("./users/user$id/carreras", 0755, true);
        mkdir("./users/user$id/carreras/imagenes", 0755, true);
    }


    move_uploaded_file($_FILES['portada']['tmp_name'], "./users/user$id/carreras/".$portada);
    move_uploaded_file($_FILES['reglamento']['tmp_name'], "./users/user$id/carreras/".$reglamento);

    foreach ($_FILES['fotos']['tmp_name'] as $key => $tmp_name) {
        $foto = uniqid() . '-' . $_FILES['fotos']['name'][$key];
        move_uploaded_file($tmp_name, "./users/user$id/carreras/imagenes/".$foto);
    }


    foreach ($_POST['modalidades'] as $key => $jsonModalidad) {
        $modalidad = json_decode($jsonModalidad, true);

        $nombreModalidad = $modalidad['modalidad'];
        $sexo = $modalidad['sexo'];
        $categorias = $modalidad['categorias'];
    }

    $query = "INSERT INTO carreras (nombre, fecha, enlaceWeb, reglamento, portada, track, localizacion, distancia, desnivel, modalidad, sexo) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    $stmt = $con->prepare($query);
    $stmt->bind_param('sssssssiiss',$nombreCarrera,$fechaCarrera,$enlaceWeb,$reglamento,$portada,$coordenadas,$localizacion,$distancia,$desnivel,$nombreModalidad,$sexo);

    try {
        $stmt->execute();

        $query2 = "INSERT into categoria (id_carrera, nombre) values ((SELECT MAX(id) FROM carreras),?)";
        $stmt = $con->prepare($query2);
        $contadorPremios = 0;
        foreach ($categorias as $categoria) {
            $contadorPremios++;
            $stmt->bind_param('s',$categoria['nombre']);
            try {
                $stmt->execute();
                $queryPremios = "INSERT into premios (id_categoria, primero,segundo,tercero) values ((SELECT MAX(id) FROM categoria),?,?,?)";
                $stmt = $con->prepare($queryPremios);
                $stmt->bind_param('sss',$categoria['premios'][1],$categoria['premios'][2],$categoria['premios'][3]);
                
                try {
                    $stmt->execute();
                } catch (mysqli_sql_exception $e){
                    header("HTTP/1.1 400 Bad Request");
                }

            } catch (mysqli_sql_exception $e) {
                header("HTTP/1.1 400 Bad Request");
            }

        }

        if ($contadorPremios == 3) {
            header('Content-Type: application/json');
            header("HTTP/1.1 201 Created");
            echo json_encode(["Carrera creada" => "Carrera creada"]);
        }
    } catch (mysqli_sql_exception $e) {
        header("HTTP/1.1 400 Bad Request");
    }



        
    


}
?>