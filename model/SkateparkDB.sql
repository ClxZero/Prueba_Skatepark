CREATE DATABASE skatepark;

\c skatepark

CREATE TABLE skaters(
    id SERIAL, 
    email VARCHAR(50) NOT NULL, 
    nombre VARCHAR(25) NOT NULL, 
    password VARCHAR(25) NOT NULL, 
    anos_experiencia INT NOT NULL, 
    especialidad VARCHAR(50) NOT NULL, 
    foto VARCHAR(255) NOT NULL, 
    estado BOOLEAN NOT NULL);


INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ('TonyHawk@terra.cl', 'Tony Halkon', '1234', '23', 'Bailar cueca', './uploads/tony.jpg', 't');
INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ('1', 'email y pass es', '1', '1', 'solo un 1', './uploads/willy.jpg', 'f');

