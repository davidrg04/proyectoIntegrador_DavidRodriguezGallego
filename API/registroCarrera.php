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


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $key = "proyectoDavid";
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : null;

    list(, $jwt) = explode(' ', $authHeader);
    $jwtDecoded = JWT::decode($jwt, new Key($key, 'HS256'));
    $id = $jwtDecoded->id;
    $nombreCarrera = $_POST['nombre'];
    $fechaCarrera = $_POST['fecha'];
    $enlaceWeb = $_POST['web'];
    $reglamento = uniqid() . '-' . $_FILES['reglamento']['name'];
    $portada = uniqid() . '-' . $_FILES['fotoPortada']['name'];
    $track = $_POST['coordenadas'];
    $localizacion = $_POST['localizacion'];
    $distancia = $_POST['distancia'];
    $desnivel = $_POST['desnivel'];

    $modalidades = json_decode($_POST['modalidades'], true);
    $modalidadNombre = $modalidades[0]['modalidad'];
    $sexo = $modalidades[0]['sexo'];

    $añadirCarrera = "INSERT INTO carreras (id_usuario, nombre, fecha, enlaceWeb, reglamento, portada, track, localizacion, distancia, desnivel,modalidad,sexo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $con->prepare($añadirCarrera);
    $stmt->bind_param("isssssssssss", $id, $nombreCarrera, $fechaCarrera, $enlaceWeb, $reglamento, $portada, $track, $localizacion, $distancia, $desnivel, $modalidadNombre, $sexo);

    try {
        if ($stmt->execute()) {
            $idCarrera = $con->insert_id;
            
            $añadirCategoria = "INSERT INTO categoria (id_carrera, nombre) VALUES (?, ?)";
            $stmtCategoria = $con->prepare($añadirCategoria);

        // Iterar sobre cada categoría en el array de modalidades
            foreach ($modalidades[0]['categorias'] as $categoria) {
                $premios = $categoria['premios'];
                $nombreCategoria = $categoria['nombre'];
                
                $stmtCategoria->bind_param("is", $idCarrera, $nombreCategoria);
                
                try {
                    if ($stmtCategoria->execute()) {
                        $idCategoria = $con->insert_id;
                        $añadirPremios = "INSERT INTO premios (id_categoria, primero, segundo, tercero) VALUES (?, ?, ?, ?)";
                        $stmtPremios = $con->prepare($añadirPremios);
                        $stmtPremios->bind_param("isss",$idCategoria, $premios[0], $premios[1], $premios[2]);
                        try {
                            $stmtPremios->execute();
                        } catch (\Throwable $th) {
                            header('Content-Type: application/json');
                            header('HTTP/1.1 400 Bad Request'); 
                            echo json_encode(['error' => $e->getMessage()]);
                            exit;
                        }
                    }else {
                        throw new Exception("Error al insertar categoría: " . $stmtCategoria->error);
                    }
                   
                } catch (mysqli_sql_exception $e) {
                    header('Content-Type: application/json');
                    header('HTTP/1.1 400 Bad Request'); 
                    echo json_encode(['error' => $e->getMessage()]);
                    exit;
                }
            }

            $con->commit();
            $stmtCategoria->close();
            $stmtPremios->close();

           

                $numArchivos = count($_FILES["fotos"]["name"]);
                if (!is_dir("./users/user$id/carreras")) {
                    mkdir("./users/user$id/carreras", 0755, true);
                    mkdir("./users/user$id/carreras/imagenes", 0755, true);
                }
                move_uploaded_file($_FILES["portada"]["tmp_name"], "./users/user$id/carreras/imagenes/" . $portada);
                move_uploaded_file($_FILES["reglamento"]["tmp_name"], "./users/user$id/carreras/" . $reglamento);
                
                for ($i = 0; $i < $numArchivos; $i++) {
                    $nombreUnico = uniqid() . '-' . $_FILES["fotos"]["name"][$i];
                    $rutaDestino = "./users/user$id/carreras/imagenes/" . $nombreUnico;
                    move_uploaded_file($_FILES["fotos"]["tmp_name"][$i], $rutaDestino);

                    $añadirFotos = "INSERT INTO fotos (id_carrera, nombreFoto) VALUES ($idCarrera, ?)";
                    $stmtFotos = $con->prepare($añadirFotos);
                    $stmtFotos->bind_param("s", $nombreUnico);
                    try {
                        $stmtFotos->execute();
                    } catch (\Throwable $th) {
                        header('Content-Type: application/json');
                        header('HTTP/1.1 400 Bad Request'); 
                        echo json_encode(['error' => $e->getMessage()]);
                        exit;
                    }
        
                }
            


        }
    } catch (\Throwable $e) {
        header('Content-Type: application/json');
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => $e->getMessage()]);
    }
}



?>