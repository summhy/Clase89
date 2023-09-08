const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Configuración de roles y permisos
const roles = {
  rodolfo: 'admin',
  susana: 'usuario',
  pepito:'usuario'
};

// Middleware de autenticación con JWT
const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de la solicitud
  const token = req.header('Authorization');
console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, 'secreto');

    // Agregar el rol decodificado a la solicitud
    req.rol = decoded.rol;
console.log(req.rol)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Acceso denegado. Token inválido.' });
  }
};

// Ruta protegida para usuarios con rol de administrador
app.get('/admin', authMiddleware, (req, res) => {
  if (req.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Permiso insuficiente.' });
  }

  res.json({ message: 'Bienvenido, administrador!' });
});

// Ruta protegida para usuarios con rol de usuario
app.get('/usuario', authMiddleware, (req, res) => {
  if (req.rol !== 'usuario') {
    return res.status(403).json({ message: 'Acceso denegado. Permiso insuficiente.' });
  }

  res.json({ message: 'Bienvenido, usuario!' });
});

// Ruta de inicio de sesión que emite un token JWT válido para el usuario
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  const rol = roles[usuario];

  if (!rol) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  // Verificar la contraseña (esto es solo un ejemplo, en un caso real se debe usar una función de hash segura)
  if (contraseña !== '123456') {
    return res.status(401).json({ message: 'Contraseña incorrecta.' });
  }

  // Firmar el token JWT con el rol del usuario y una clave secreta
  const token = jwt.sign({ rol }, 'secreto');

  res.json({ token });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
