CREATE DATABASE registro;
USE registro;

CREATE TABLE clientes(
	codigo INT PRIMARY KEY IDENTITY(1000,1),
	nombre VARCHAR(30),
	apellido VARCHAR(30),
	fecha_de_nacimiento VARCHAR(30),
	DPI BIGINT,
	correo VARCHAR(50),
	telefono BIGINT,
	usuario VARCHAR(30),
	contraseña VARCHAR(30),
	banco VARCHAR(15),
	monto INT,
	estado BIT,
);

SELECT * FROM clientes;

INSERT INTO clientes(nombre,apellido,fecha_de_nacimiento,DPI,correo,telefono,usuario,contraseña,banco,monto,estado)
VALUES ('Eduardo','Fu','20/12/2002',3023043040101,'eduardo.fu@galileo.edu',58806672,'eduardofujeje','ciscO@123','Industrial',150,1);

INSERT INTO clientes(nombre,apellido,fecha_de_nacimiento,DPI,correo,telefono,usuario,contraseña,banco,monto,estado)
VALUES ('Daniella','Alvarez','10/10/2003',3021675360101,'daniella.alvarez@galileo.edu',55327920,'daniellajeje','ciscO@123','Banrural',1500,1);

INSERT INTO clientes(nombre,apellido,fecha_de_nacimiento,DPI,correo,telefono,usuario,contraseña,banco,monto,estado)
VALUES ('Lalo','Perez','01/02/1999',3021051570101,'lalo.perez@galileo.edu',48965789,'laloooo1','andreA@145','Industrial',10000,0);