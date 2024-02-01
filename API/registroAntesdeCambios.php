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
        $organizador = $data['organizador'];
        if (isset($data['telefono']) && isset($data['organizacion'])) {
            $telefono = $data['telefono'];
            $nombreOrg = $data['nombreOrg'];
        }

       

        
        //Comprobacion del username
        $query = "SELECT username FROM usuarios WHERE username = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            echo json_encode("Username ya esta cogido");
            exit;
        }
        
        
        //Comprobacion del mail
        $query = "SELECT mail FROM usuarios WHERE mail = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $mail);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            echo json_encode("Email ya esta registrado");
            exit;
        }

        //Comprobacion telegono
        if (isset($telefono)) {
            $query = "SELECT telefono FROM usuarios WHERE telefono = ?";
            $stmt = $con->prepare($query);
            $stmt->bind_param("s", $telefono);
            $stmt->execute();
            $stmt->store_result();
            if ($stmt->num_rows > 0) {
                echo json_encode("Telefono ya esta registrado");
                exit;
            }
        }

        
        $sql = "INSERT INTO usuarios (nombreCompleto, username, mail, pass, poblacion, organizador, telefono, nombreOrg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssssssss", $nombreCompleto, $username, $mail, $pass, $poblacion, $organizador, $telefono, $nombreOrg);
        try{
            $stmt->execute();
            header("HTTP/1.1 201 Created");
            echo json_encode("User created");
        } catch (mysqli_sql_exception $e){
            error_log('Error al insertar usuario: ' . $e->getMessage());
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["error" => "Error al insertar usuario: " . $e->getMessage()]);
            exit;
        }
    }else{
        header("HTTP/1.1 400 Bad Request");
    }
    exit;
    
?>
