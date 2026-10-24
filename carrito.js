
const productos = {
    1: { nombre: "Brasier elegante", precio: 850 },
    2: { nombre: "Panty clásico", precio: 350 },
    3: { nombre: "Conjunto íntimo", precio: 1500 },
    4: { nombre: "Body femenino", precio: 1200 },
    5: { nombre: "Pijama de mujer", precio: 1350 },
    6: { nombre: "Top interior", precio: 650 },
    7: { nombre: "Panty de encaje", precio: 450 },
    8: { nombre: "Brasier deportivo", precio: 950 },
    9: { nombre: "Short interior femenino", precio: 500 },
    10: { nombre: "Conjunto para dormir femenino", precio: 1600 },
    11: { nombre: "Bóxer clásico", precio: 450 },
    12: { nombre: "Bóxer deportivo", precio: 550 },
    13: { nombre: "Calzoncillo tipo slip", precio: 350 },
    14: { nombre: "Camiseta interior", precio: 550 },
    15: { nombre: "Pijama masculina", precio: 1250 },
    16: { nombre: "Bóxer de algodón", precio: 500 },
    17: { nombre: "Pack de bóxers", precio: 1200 },
    18: { nombre: "Short interior masculino", precio: 400 },
    19: { nombre: "Camiseta sin mangas", precio: 500 },
    20: { nombre: "Conjunto para dormir masculino", precio: 1450 }
};

let carrito = [];

const contador = document.getElementById("contador");
const lista = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formulario-pedido");
const confirmacion = document.getElementById("confirmacion");

const moneda = cantidad =>
    "RD$ " + cantidad.toLocaleString("es-DO");

function mostrarCarrito() {
    lista.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(item => {
        const producto = productos[item.id];
        const subtotal = producto.precio * item.cantidad;

        total += subtotal;
        cantidadTotal += item.cantidad;

        const li = document.createElement("li");

        li.appendChild(document.createTextNode(
            `${producto.nombre} — ${moneda(producto.precio)} × ${item.cantidad} = ${moneda(subtotal)} `
        ));

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "quitar";
        quitar.textContent = "Quitar uno";

        quitar.addEventListener("click", () => {
            quitarProducto(item.id);
        });

        li.appendChild(quitar);
        lista.appendChild(li);
    });

    contador.textContent = cantidadTotal;
    totalElemento.textContent = moneda(total);

    mensaje.textContent = carrito.length
        ? "Estos son los productos que seleccionaste."
        : "Todavía no has añadido productos.";

    return total;
}

function agregarProducto(id) {
    const existente = carrito.find(item => item.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id, cantidad: 1 });
    }

    confirmacion.textContent = "";
    mostrarCarrito();
}

function quitarProducto(id) {
    const existente = carrito.find(item => item.id === id);

    if (!existente) return;

    existente.cantidad--;

    if (existente.cantidad === 0) {
        carrito = carrito.filter(item => item.id !== id);
    }

    mostrarCarrito();
}

document.querySelectorAll(".agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        agregarProducto(Number(boton.dataset.id));
    });
});

document.getElementById("vaciar").addEventListener("click", () => {
    carrito = [];
    formulario.hidden = true;
    confirmacion.textContent = "";
    mostrarCarrito();
});

document.getElementById("pagar").addEventListener("click", () => {
    if (carrito.length === 0) {
        mensaje.textContent = "Primero añade productos al carrito.";
        return;
    }

    alert("Total de tu compra: " + moneda(mostrarCarrito()));
});

document.getElementById("completar").addEventListener("click", () => {
    if (carrito.length === 0) {
        mensaje.textContent = "Añade productos antes de completar la compra.";
        return;
    }

    formulario.hidden = false;
    formulario.scrollIntoView({ behavior: "smooth" });
});

formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    if (carrito.length === 0) return;

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !correo || !telefono || !direccion) return;

    const pedido = {
        cliente: nombre,
        correo,
        telefono,
        direccion,
        productos: carrito.map(item => ({
            nombre: productos[item.id].nombre,
            precio: productos[item.id].precio,
            cantidad: item.cantidad
        })),
        total: carrito.reduce(
            (suma, item) =>
                suma + productos[item.id].precio * item.cantidad,
            0
        )
    };

    const pedidos = JSON.parse(
        localStorage.getItem("pedidosModaIntima") || "[]"
    );

    pedidos.push(pedido);
    localStorage.setItem("pedidosModaIntima", JSON.stringify(pedidos));

    confirmacion.textContent =
        `Pedido preparado para ${nombre}. Total: ${moneda(pedido.total)}. ` +
        "Se guardó en este navegador; todavía no se ha enviado a la tienda.";

    carrito = [];
    formulario.reset();
    formulario.hidden = true;
    mostrarCarrito();
});

mostrarCarrito();
