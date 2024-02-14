<?php
    require '../vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;


    function generateJWT($username,$pass, $rol, $id){
        $key = "proyectoDavid";

        $payload = [
            
            'iat' => time(),
            'rol' => $rol,
            'id' => $id,
            'username' => $username,
            'exp' => time()+3600
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');

        return $jwt;

    }
    
?>