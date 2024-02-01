<?php
    require '../vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;


    function generateJWT($username,$pass, $rol, $id){
        $key = "proyectoDavid";

        $payload = [
            'iss' => 'localhost',
            'aud' => 'localhost',
            'iat' => $username,
            'nbf' => $pass,
            'rol' => $rol,
            'id' => $id,
            'exp' => time()+3600
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');

        return $jwt;

    }
    
?>