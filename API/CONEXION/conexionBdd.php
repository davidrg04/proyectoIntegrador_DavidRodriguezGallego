<?php
    Class Conexion extends mysqli{
        private $host = 'localhost';
        private $db = 'runthemountain';
        private $user = 'root';
        private $pass = '';


        public function __construct() {
            try {
                parent:: __construct($this->host,$this->user, $this->pass, $this->db);
                if ($this->connect_error) {
                    throw new mysqli_sql_exception('Error de conexión: ' . $this->connect_error);
                }
            } catch (mysqli_sql_exception $e) {
                error_log($e->getMessage()); // Registra el error en el archivo de logs
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(['error' => $e->getMessage()]);
                exit;
            }
        }
    }
?>