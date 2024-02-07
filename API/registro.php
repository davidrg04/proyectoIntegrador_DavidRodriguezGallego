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
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nombreCompleto = $data['nombreCompleto'];
        $username = $data['username'];
        $mail = $data['mail'];
        $pass = $data['password'];
        $poblacion = $data['poblacion'];
        $fotoPerfil = $data['fotoPerfil'];
        $organizador = false;

        if (isset($data['telefono']) && isset($data['nombreOrg'])) {
            $telefono = $data['telefono'];
            $nombreOrg = $data['nombreOrg'];
            $organizador = true;
            // echo json_encode("ENTRO");
            
                $query = "SELECT telefono FROM organizador WHERE telefono = ? ";
                $stmt = $con->prepare($query);
                $stmt->bind_param("s", $telefono);
                $stmt->execute();
                $stmt->store_result();
                if ($stmt->num_rows > 0) {
                    header('Content-Type: application/json');
                    header("HTTP/1.1 400 Bad Request");
                    echo json_encode(["error" => "Telefono ya registrado"]);
                    exit;
                }
            
        }

       

        
        //Comprobacion del username
        $query = "SELECT username FROM usuarios WHERE username = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            header('Content-Type: application/json');
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "Username ya registrado"]);
            exit;
        }
        
        
        //Comprobacion del mail
        $query = "SELECT mail FROM usuarios WHERE mail = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $mail);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            header('Content-Type: application/json');
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "Email ya registrado"]);
            exit;
        }

    

        
        $sql = "INSERT INTO usuarios (fotoPerfil, nombreCompleto, username, mail, pass, poblacion) VALUES (?, ?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssssss", $fotoPerfil, $nombreCompleto, $username, $mail, $pass, $poblacion);
        try{
            $stmt->execute();
            $userId = mysqli_insert_id($con);
            $userCarpeta = "./users/user" . $userId;
            if (!file_exists($userCarpeta)) {
                mkdir($userCarpeta, 0755, true);
                mkdir($userCarpeta . "/fotos", 0755, true);
                $fotoPredeterminada = "./users/perfil.png";
                $fotoDestino = $userCarpeta . "/fotos/perfil.png";
                copy($fotoPredeterminada, $fotoDestino);
            }
            header('Content-Type: application/json');
            header("HTTP/1.1 201 Created");
            echo json_encode(["User Created" => "Usuario creado"]);
        } catch (mysqli_sql_exception $e){
            error_log('Error al insertar usuario: ' . $e->getMessage());
            header('Content-Type: application/json');
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "Error al insertar usuario: " . $e->getMessage()]);
            exit;
        }

        if($organizador == true){
            $sql = "INSERT INTO organizador (id_usuario, telefono, nombreOrg) VALUES ((SELECT MAX(id) FROM usuarios), ?,?);";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("ss",$telefono,$nombreOrg);

            try {
                $stmt->execute();
                header('Content-Type: application/json');
                header("HTTP/1.1 201 Created");
                echo json_encode(["User Created" => "Usuario creado"]);
            } catch (mysqli_sql_exception $e) {
                error_log('Error al insertar usuario: ' . $e->getMessage());
                header('Content-Type: application/json');
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(["error" => "Error al insertar usuario: " . $e->getMessage()]);
                exit;
            }
        }
    }else{
        header("HTTP/1.1 400 Bad Request");
    }
    exit;
    
?>
