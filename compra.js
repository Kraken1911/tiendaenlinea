document.addEventListener('DOMContentLoaded', () => {
    const listaProductos = document.getElementById('lista-productos');
    const listaCarrito = document.getElementById('lista-carrito');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const comprarBtn = document.getElementById('comprar');
    const totalCarrito = document.getElementById('total-carrito');

    // Función para cargar productos desde la API
    async function cargarProductos() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const productos = await response.json();
            productos.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('col-md-4', 'producto');
                div.innerHTML = `
                    <div class="card">
                        <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.title}</h5>
                            <p class="card-text">Precio: $${producto.price}</p>
                            <button class="btn btn-primary" data-id="${producto.id}" data-title="${producto.title}" data-price="${producto.price}">Añadir al Carrito</button>
                        </div>
                    </div>
                `;
                listaProductos.appendChild(div);
            });

            // Añadir eventos a los botones después de cargar los productos
            document.querySelectorAll('.btn-primary').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const title = e.target.getAttribute('data-title');
                    const price = parseFloat(e.target.getAttribute('data-price'));
                    agregarAlCarrito(id, title, price);
                });
            });

        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    // LocalStorage para el carrito
    function guardarCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        calcularTotal(carrito);
    }

    function cargarCarrito() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        listaCarrito.innerHTML = '';
        carrito.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('col-md-12', 'item-carrito');
            div.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Precio: $${item.price}</p>
                        <p class="card-text">Cantidad: ${item.cantidad}</p>
                        <button class="btn btn-danger" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            `;
            listaCarrito.appendChild(div);
        });
        calcularTotal(carrito);

        // Añadir eventos a los botones de eliminar después de cargar el carrito
        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                eliminarDelCarrito(id);
            });
        });
    }

    function agregarAlCarrito(id, title, price) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const item = carrito.find(prod => prod.id == id);

        if (item) {
            item.cantidad += 1;
        } else {
            carrito.push({ id, title, price, cantidad: 1 });
        }

        guardarCarrito(carrito);
        cargarCarrito();
    }

    function eliminarDelCarrito(id) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito = carrito.filter(prod => prod.id != id);

        guardarCarrito(carrito);
        cargarCarrito();
    }

    function calcularTotal(carrito) {
        let total = 0;
        carrito.forEach(item => {
            total += item.price * item.cantidad;
        });
        totalCarrito.textContent = total.toFixed(2);
    }

    vaciarCarritoBtn.addEventListener('click', () => {
        localStorage.removeItem('carrito');
        cargarCarrito();
    });

    comprarBtn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('El carrito está vacío.');
            return;
        }

        let recibo = 'Recibo de Compra\n\n';
        recibo += 'Productos:\n';
        carrito.forEach(item => {
            recibo += `${item.title} - $${item.price} x ${item.cantidad}\n`;
        });
        recibo += `\nTotal: $${totalCarrito.textContent}`;

        const blob = new Blob([recibo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recibo.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        alert('Compra realizada con éxito!');
        localStorage.removeItem('carrito');
        cargarCarrito();
    });

    cargarProductos();
    cargarCarrito();
});
