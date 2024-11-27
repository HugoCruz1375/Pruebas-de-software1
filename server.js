const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

// Crear la aplicación de express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Asegúrate de que el archivo index.html esté en la carpeta "public"
});

// Ruta para enviar el correo
app.post('/send-email', (req, res) => {
    const { email, carrito } = req.body;

    // Configuración del transporte con nodemailer (usa tus credenciales)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu_correo@gmail.com', // Cambia esto por tu correo
            pass: 'tu_contraseña' // Cambia esto por tu contraseña
        }
    });

    // Generar la lista de productos del carrito
    const listaCompras = carrito
        .map((item) => `<li>${item.nombre} - $${item.precio} MXN</li>`)
        .join('');
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);

    // Configurar el correo a enviar
    const mailOptions = {
        from: 'tu_correo@gmail.com', // Cambia esto por tu correo
        to: email,
        subject: 'Tu lista de compras - Dulce Trago',
        html: `
            <h1>Gracias por tu compra</h1>
            <p>Estos son los productos de tu carrito:</p>
            <ul>${listaCompras}</ul>
            <p><strong>Total: $${total.toFixed(2)} MXN</strong></p>
        `,
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error al enviar el correo.');
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).send('Correo enviado con éxito.');
        }
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
