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

            $con->begin_transaction();

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

                }

                $query = "DELETE FROM organizador where id_usuario = ?";
                $stmtOrganizador = $con->prepare($query);
                $stmtOrganizador->bind_param("i", $id);
                $stmtOrganizador->execute();

                $stmt->store_result();
                if ($stmt->affected_rows > 0) {
                    $query2 = "DELETE FROM usuarios where id = ?";
                    $stmt = $con->prepare($query2);
                    $stmt->bind_param("i", $id);
                    try {
                        $stmt->execute();
                        
                        try {
                            $carrerasImagenes = "./users/user$id/carreras/imagenes";
                            $carreras = "./users/user$id/carreras";
                            $fotos = "./users/user$id/fotos";
                            $personal = "./users/user$id";

                            if (is_dir($carrerasImagenes)) {
                                $files = glob($carrerasImagenes . '/*'); 
                                foreach ($files as $file) { 
                                    if (is_file($file)) {
                                        unlink($file); 
                                    }
                                }
                                rmdir($carrerasImagenes);
                            }

                            if (is_dir($carreras)) {
                                $files = glob($carreras . '/*'); 
                                foreach ($files as $file) { 
                                    if (is_file($file)) {
                                        unlink($file); 
                                    }
                                }
                                rmdir($carreras);
                            }

                            if (is_dir($fotos)) {
                                $files = glob($fotos . '/*'); 
                                foreach ($files as $file) { 
                                    if (is_file($file)) {
                                        unlink($file); 
                                    }
                                }
                                rmdir($fotos);
                            }

                            if (is_dir($personal)) {
                                rmdir($personal);
                            }

                            $con->commit();
                            header("HTTP/1.1 200 OK");

                        } catch (\Throwable $th) {
                            
                            header("HTTP/1.1 500 Internal Server Error");                        
                        }


                        
                    } catch (mysqli_sql_exception $e) {
                        $con->rollback();
                        header("HTTP/1.1 400 Bad Request");
                    }
                }

            } catch (mysqli_sql_exception $e) {
                $con->rollback();
                header("HTTP/1.1 400 Bad Request");
            }

            // $query = "DELETE FROM organizador where id_usuario = ?";
            // $stmt = $con->prepare($query);
            // $stmt->bind_param("i", $id);
            // try {
            //     $stmt->execute();
            //     $stmt->store_result();
            //     if ($stmt->affected_rows > 0) {
            //         $query2 = "DELETE FROM usuarios where id = ?";
            //         $stmt = $con->prepare($query2);
            //         $stmt->bind_param("i", $id);
            //         try {
            //             $stmt->execute();
            //             header("HTTP/1.1 200 OK");
            //         } catch (mysqli_sql_exception $e) {
            //             header("HTTP/1.1 400 Bad Request");
            //         }
            //     }
            // } catch (mysqli_sql_exception $e) {
            //     header("HTTP/1.1 400 Bad Request");
            // }
        }else {
            $queryFavoritos = "DELETE FROM favoritos WHERE id_usuario = ?";
            $stmtFavoritos = $con->prepare($queryFavoritos);
            $stmtFavoritos->bind_param("i", $id);

            $con->begin_transaction();
            try {
                $stmtFavoritos->execute();

                $query3 = "DELETE FROM usuarios where id = ?";
                    $stmt = $con->prepare($query3);
                    $stmt->bind_param("i", $id);
                    try {
                        $stmt->execute();

                        try {
                            
                            $fotos = "./users/user$id/fotos";
                            $personal = "./users/user$id";


                            if (is_dir($fotos)) {
                                $files = glob($fotos . '/*'); 
                                foreach ($files as $file) { 
                                    if (is_file($file)) {
                                        unlink($file); 
                                    }
                                }
                                rmdir($fotos);
                            }

                            if (is_dir($personal)) {
                                rmdir($personal);
                            }
                            $con->commit();
                            header("HTTP/1.1 200 OK");
                        } catch (\Throwable $th) {
                            header("HTTP/1.1 500 Internal Server Error");                        
                        } 
                    } catch (mysqli_sql_exception $e) {
                        $con->rollback();
                        header("HTTP/1.1 400 Bad Request");
                    }


            } catch (mysqli_sql_exception $e) {
                $con->rollback();
                header("HTTP/1.1 400 Bad Request");
            };
            
        }
    }
?>