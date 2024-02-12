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
        $localizacion = $_POST['localizacion'];
        $distancia = $_POST['distancia'];

        $modalidades = json_decode($_POST['modalidades'], true);
        $modalidadNombre = $modalidades[0]['modalidad'];
        $sexo = $modalidades[0]['sexo'];

        if (isset($_POST["coordenadas"])) {
            $track = $_POST['coordenadas'];
            $desnivel = $_POST['desnivel'];
        }else{
            
            $trackAntiguo = "SELECT track FROM CARRERAS WHERE nombre = ?";
            $stmt = $con->prepare($trackAntiguo);
            $stmt->bind_param("s", $nombreCarrera);
            try{
                $stmt->execute();
                $result = $stmt->get_result();
                $row = $result->fetch_assoc();
                $track = $row["track"];

                $desnivelAntiguo = "SELECT desnivel FROM CARRERAS WHERE nombre = ?";
                $stmtDesnivel = $con->prepare($desnivelAntiguo);
                $stmtDesnivel->bind_param("s", $nombreCarrera);
                $stmtDesnivel->execute();
                $resultDesnivel = $stmtDesnivel->get_result();
                $rowDesnivel = $resultDesnivel->fetch_assoc();
                $desnivel = $rowDesnivel["desnivel"];

            }catch(\Throwable $th){
                header('Content-Type: application/json');
                header('HTTP/1.1 400 Bad Request'); 
                echo json_encode(['error' => $th->getMessage()]);
                exit;
            }
        }


        $portadaAntigua = "SELECT portada FROM CARRERAS WHERE nombre = ?";
        $stmtPortada = $con->prepare($portadaAntigua);
        $stmtPortada->bind_param("s", $nombreCarrera);

        try {
            $stmtPortada->execute();
            $result = $stmtPortada->get_result();
            $row = $result->fetch_assoc();
            $ficheroPortadaAntigua = $row["portada"];

            if (isset($_FILES["fotoPortada"])) {
                $portada = uniqid() . '-' . $_FILES['fotoPortada']['name'];
                
                unlink("./users/user$id/carreras/imagenes/" . $ficheroPortadaAntigua);
                move_uploaded_file($_FILES["fotoPortada"]["tmp_name"], "./users/user$id/carreras/imagenes/" . $portada);
            }else {
                $portada = $ficheroPortadaAntigua;
                
            }

        } catch (\Throwable $th) {
            header('Content-Type: application/json');
            header('HTTP/1.1 400 Bad Request'); 
            echo json_encode(['error' => $th->getMessage()]);
            exit;
        }

        $reglamentoAntiguo = "SELECT reglamento FROM CARRERAS WHERE nombre = ?";
        $stmtReglamento = $con->prepare($reglamentoAntiguo);
        $stmtReglamento->bind_param("s", $nombreCarrera);

        try {
            $stmtReglamento->execute();
            $result = $stmtReglamento->get_result();
            $row = $result->fetch_assoc();
            $ficheroReglamentoAntiguo = $row["reglamento"];

            if (isset($_FILES["reglamento"])) {
                $reglamento = uniqid() . '-' . $_FILES['reglamento']['name'];
                
                unlink("./users/user$id/carreras/" . $ficheroReglamentoAntiguo);
                move_uploaded_file($_FILES["reglamento"]["tmp_name"], "./users/user$id/carreras/imagenes/" . $reglamento);
            }else {
                $reglamento = $ficheroReglamentoAntiguo;
                
            }

        } catch (\Throwable $th) {
            header('Content-Type: application/json');
            header('HTTP/1.1 400 Bad Request'); 
            echo json_encode(['error' => $th->getMessage()]);
            exit;
        }

        $idCarreraQuery = "SELECT id FROM carreras WHERE nombre = ?";
        $stmtIdCarrera = $con->prepare($idCarreraQuery);
        $stmtIdCarrera->bind_param("s", $nombreCarrera);
        try {
            $stmtIdCarrera->execute();
            $result = $stmtIdCarrera->get_result();
            $row = $result->fetch_assoc();
            $idCarrera = $row["id"];
        } catch (\Throwable $th) {
            header('Content-Type: application/json');
            header('HTTP/1.1 400 Bad Request'); 
            echo json_encode(['error' => $th->getMessage()]);
            exit;
        }
        
            
            if (isset($_FILES["fotos"])) {
                
                    $fotosBase="SELECT nombreFoto FROM fotos WHERE id_carrera = ?";
                    $stmtFotosBase = $con->prepare($fotosBase);
                    $stmtFotosBase->bind_param("i", $idCarrera);
                try {
                    $stmtFotosBase->execute();
                    $resultFotos = $stmtFotosBase->get_result();
                    $fotosAntiguas = [];
                    while ($row = $resultFotos->fetch_assoc()) {
                        $fotosAntiguas[] = $row;
                    }

                }catch(\Throwable $th){
                    header('Content-Type: application/json');
                    header('HTTP/1.1 400 Bad Request'); 
                    echo json_encode(['error' => $th->getMessage()]);
                    exit;
                }

                foreach ($fotosAntiguas as $foto) {
                    unlink("./users/user$id/carreras/imagenes/" . $foto);
                }

                $borrarFotosAntiguas = "DELETE FROM fotos WHERE id_carrera = ?";
                $stmtBorrarFotos = $con->prepare($borrarFotosAntiguas);
                $stmtBorrarFotos->bind_param("i", $idCarrera);
                try {
                    $stmtBorrarFotos->execute();
                } catch (\Throwable $th) {
                    header('Content-Type: application/json');
                    header('HTTP/1.1 400 Bad Request'); 
                    echo json_encode(['error' => $th->getMessage()]);
                    exit;
                }


                $numArchivos = count($_FILES["fotos"]["name"]);
                if (!is_dir("./users/user$id/carreras")) {
                    mkdir("./users/user$id/carreras", 0755, true);
                    mkdir("./users/user$id/carreras/imagenes", 0755, true);
                }
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
                        echo json_encode(['error' => $th->getMessage()]);
                        exit;
                    }
        
                }
            }


            $queryIdCategorias = "SELECT id FROM categoria WHERE id_carrera = ?";
            $stmtIdCategorias = $con->prepare($queryIdCategorias);
            $stmtIdCategorias->bind_param("i", $idCarrera);
            try {
                $stmtIdCategorias->execute();
                $result = $stmtIdCategorias->get_result();
                $idCategorias = [];
                while ($row = $result->fetch_assoc()) {
                    $idCategorias[] = $row;
                }
                
                $borrarPremios = "DELETE FROM premios WHERE id_categoria = ?";
                
                foreach ($idCategorias as $idCategoria) {
                    $stmtBorrarPremios = $con->prepare($borrarPremios);
                    $stmtBorrarPremios->bind_param("i", $idCategoria);
                    $stmtBorrarPremios->execute();
                }
                
                $borrarCategorias = "DELETE FROM categoria WHERE id_carrera = ?";
                $stmtBorrarCategorias = $con->prepare($borrarCategorias);
                $stmtBorrarCategorias->bind_param("i", $idCarrera);

                $stmtBorrarCategorias->execute();
                
                

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
                    
                    } catch (\Throwable $th) {
                        header('Content-Type: application/json');
                        header('HTTP/1.1 400 Bad Request'); 
                        echo json_encode(['error' => $e->getMessage()]);
                        exit;
                    }
                }
                

            } catch (\Throwable $th) {
                header('Content-Type: application/json');
                header('HTTP/1.1 400 Bad Request'); 
                echo json_encode(['error' => $th->getMessage()]);
                exit;
            }



            
            $actualizarCarrera = "UPDATE carreras SET nombre = ?, fecha = ?, enlaceWeb = ?, localizacion = ?, distancia = ?, modalidad = ?, sexo = ?, track = ?, desnivel = ?, portada = ?, reglamento = ? WHERE id = ?";
            $stmt = $con->prepare($actualizarCarrera);
            $stmt->bind_param("sssssssssssi", $nombreCarrera, $fechaCarrera, $enlaceWeb, $localizacion, $distancia, $modalidadNombre, $sexo, $track, $desnivel, $portada, $reglamento, $idCarrera);
            try {
                $updatedCarrera = [
                    'nombre' => $nombreCarrera,
                    'fecha' => $fechaCarrera,
                    'enlaceWeb' => $enlaceWeb,
                    'localizacion' => $localizacion,
                    'distancia' => $distancia,
                    'modalidad' => $modalidadNombre,
                    'sexo' => $sexo,
                    'track' => $track,
                    'desnivel' => $desnivel,
                    'portada' => $portada,
                    'reglamento' => $reglamento,
                    'id' => $idCarrera
                ];
                
                $stmt->execute();
                
                header("HTTP/1.1 200 OK");
                // echo json_encode($updatedCarrera);

            } catch (\Throwable $th) {
                header('Content-Type: application/json');
                header('HTTP/1.1 400 Bad Request'); 
                echo json_encode(['error' => $th->getMessage()]);
                exit;
            }
        
    }
?>