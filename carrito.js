// carrito.js
document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const listaCarrito = document.getElementById("lista-carrito");
    const mensajeCarrito = document.getElementById("mensaje-carrito");
    const totalElement = document.getElementById("total");

    // Función para agregar productos al carrito
    function agregarAlCarrito(producto) {
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Función para actualizar la vista del carrito
    function actualizarCarrito() {
        if (carrito.length === 0) {
            mensajeCarrito.textContent = "Tu carrito está vacío.";
            listaCarrito.innerHTML = '';
            totalElement.textContent = "0";
        } else {
            mensajeCarrito.textContent = "Productos en tu carrito:";
            listaCarrito.innerHTML = carrito.map(producto => `
                <li>
                    ${producto.nombre} - ${producto.precio} MXN
                    <span class="remove-item" data-nombre="${producto.nombre}">Eliminar</span>
                </li>
            `).join('');
            const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
            totalElement.textContent = total;
        }
    }

    // Función para eliminar productos del carrito
    listaCarrito.addEventListener("click", e => {
        if (e.target.classList.contains("remove-item")) {
            const nombreProducto = e.target.dataset.nombre;
            const index = carrito.findIndex(producto => producto.nombre === nombreProducto);
            if (index !== -1) {
                carrito.splice(index, 1);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            }
        }
    });

    // Event listener para los botones "Agregar al carrito"
    const botonesAgregar = document.querySelectorAll(".add-to-cart");
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const nombre = e.target.getAttribute("data-nombre");
            const precio = parseInt(e.target.getAttribute("data-precio"), 10);
            agregarAlCarrito({ nombre, precio });
        });
    });

    // Actualiza el carrito al cargar la página
    actualizarCarrito();
});
