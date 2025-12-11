$(document).ready(function () {
  
  var todosLosProductos = [];

  // Exponer variables globalmente para otros scripts
  window.todosLosProductos = todosLosProductos;

  $.getJSON("json/diccionario.json", function (data) {
    var productosContainer = $("#productos-container");

    // Verificar que los datos sean válidos
    if (!data || !data.productos) {
      productosContainer.html(
        '<div class="col-md-12"><p class="text-center">No se encontraron productos.</p></div>'
      );
      return;
    }

    todosLosProductos = data.productos;
    // Actualizar también la variable global
    window.todosLosProductos = todosLosProductos;
    filtrarPorVendidos("True");

    $(".productos-seccion h2").text("Mas Vendidos");
    
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // Manejo de errores al cargar el JSON
    console.error("Error al cargar productos:", textStatus, errorThrown);
    $("#productos-container").html(
      '<div class="col-md-12"><p class="text-center text-danger">Error al cargar los productos. Por favor, intente de nuevo más tarde.</p></div>'
    );
  });

  function mostrarProductos(productos) {
    var productosContainer = $("#productos-container");
    productosContainer.empty(); // Limpiar el contenedor antes de agregar nuevos productos

    // Filtrar solo productos con estado "activo"
    var productosActivos = productos.filter(function (producto) {
      return producto.estado === "activo";
    });

    // Verificar si hay productos para mostrar
    if (productosActivos.length === 0) {
      productosContainer.html(
        '<div class="col-md-12"><p class="text-center">No se encontraron productos en esta categoría.</p></div>'
      );
      return;
    }

    $.each(productosActivos, function (index, producto) {
      // Solo mostrar productos que tengan nombre válido
      if (producto.nombre && producto.nombre.trim() !== "") {
        
        // Determinar la URL de la imagen
        var imagenUrl;
        if (producto.imagen) {
          // Si el producto tiene imagen definida (productos agregados manualmente)
          imagenUrl = producto.imagen;
        } else {
          // Si no tiene imagen, usar el sistema de archivos (productos del JSON)
          var nombreImagen = producto.nombre.trim() + ".png";
          imagenUrl = "images/" + nombreImagen;
        }

        // Plantilla HTML para cada producto
        var productoHTML = `
            <div class="col-md-3 col-sm-6 col-xs-12">
              <div class="producto-card">
                <!-- Contenedor de la imagen del producto -->
                <div class="producto-imagen">
                  <img src = "${imagenUrl}" alt="${producto.nombre}" onerror="this.src='images/producto-default.svg'">
                </div>
                
                <!-- Información del producto -->
                <div class="producto-info">
                  <h4 class="producto-nombre">${producto.nombre}</h4>
                  <p class="producto-categoria">${
                    producto.categoria || "Sin categoría"
                  }</p>
                  <div class="producto-precio">
                    <span class="precio">${parseInt(
                      producto.precio
                    )}.00 lps</span>
                  </div>
                  
                  <!-- Botones de acción del producto -->
                  <div class="producto-botones">
                    <a href="#" class="btn btn-detalles" style="flex: 1;">
                      <i class="fas fa-eye"></i>
                      Ver Detalles
                    </a>
                  </div>
                </div>
              </div>
            </div>
                `;
        // Agregar el HTML del producto al contenedor
        productosContainer.append(productoHTML);
      }
    });
  }

  // Exponer función globalmente
  window.mostrarProductos = mostrarProductos;

  $(document).on("click", ".btn-detalles", function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace

    // Obtener el nombre del producto desde la tarjeta más cercana
    var productoCard = $(this).closest(".producto-card");
    var nombreProducto = productoCard.find(".producto-nombre").text();

    // Buscar el producto completo en el array global
    var productoCompleto = todosLosProductos.find(function (producto) {
      return producto.nombre === nombreProducto;
    });

    // Si encontramos el producto, mostrar sus detalles en el modal
    if (productoCompleto) {
      mostrarDetallesProducto(productoCompleto);
    }
  });

  function mostrarDetallesProducto(producto) {
    // Crear URL de la imagen basada en el nombre del producto
    var imagenUrl;
    if (producto.imagen) {
      imagenUrl = producto.imagen;
    } else {
      var nombreImagen = producto.nombre.trim() + ".png";
      imagenUrl = "images/" + nombreImagen;
    }

    // Llenar los elementos del modal con la información del producto
    $("#detalle-imagen").attr("src", imagenUrl).attr("alt", producto.nombre).on("error", function() {
      $(this).attr("src", "images/producto-default.svg");
    });
    $("#detalle-nombre").text(producto.nombre);
    $("#detalle-codigo").text("Código: " + (producto.codigo || "N/A"));
    $("#detalle-categoria").text(producto.categoria || "Sin categoría");
    $("#detalle-precio").text(parseInt(producto.precio).toFixed(2) + " LPS");
    $("#detalle-descripcion").text(
      producto.descripcion || "Sin descripción disponible"
    );

    // Mostrar el modal de detalles
    $("#modalDetalles").modal("show");
  }

  /* ========================================
     FUNCIONES DE FILTRADO DE PRODUCTOS
     ======================================== */
  
  /**
   * Función para filtrar productos por categoría
   */
  function filtrarPorCategoria(categoria) {
    var productosFiltrados = todosLosProductos.filter(function (producto) {
      return (
        producto.categoria &&
        producto.categoria.toLowerCase() === categoria.toLowerCase()
      );
    });
    mostrarProductos(productosFiltrados);
  }

  
  function filtrarPorVendidos(masvendidos) {
    var productosFiltrados = todosLosProductos.filter(function (producto) {
      return (
        producto.masvendidos &&
        producto.masvendidos.toLowerCase() === masvendidos.toLowerCase()
      );
    });
    mostrarProductos(productosFiltrados);
  }

  /* ========================================
     EVENT LISTENERS - NAVEGACIÓN ESPECIAL
     ======================================== */

  /** Mostrar productos más vendidos (página de inicio) */
  $("#btn-inicio").click(function (e) {
    e.preventDefault();
    filtrarPorVendidos("True");
    $(".productos-seccion h2").text("Mas Vendidos");
  });

  /**
   * Función para mostrar todos los productos
   * Se usa cuando se selecciona "Todos los productos"
   */
  function mostrarTodosLosProductos() {
    mostrarProductos(todosLosProductos);
    $(".productos-seccion h2").text("Nuestros Productos");
  }

  /** Event listener para mostrar todos los productos */
  $("#btn-productos").click(function (e) {
    e.preventDefault();
    mostrarTodosLosProductos();
  });

  // Exponer función para mostrar todos los productos
  window.mostrarTodosLosProductos = mostrarTodosLosProductos;

}); // FIN del $(document).ready()




function mostrarToast(mensaje, titulo = "¡Éxito!", tipo = "success") {
  // Obtener contenedor donde se mostrarán las notificaciones
  const toastContainer = document.getElementById("toast-container");

  // Crear el elemento toast
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${tipo}`;

  // Definir iconos según el tipo de notificación
  const iconos = {
    success: "fas fa-check-circle",      // Ícono de éxito
    error: "fas fa-exclamation-circle",  // Ícono de error
    warning: "fas fa-exclamation-triangle", // Ícono de advertencia
    info: "fas fa-info-circle",          // Ícono de información
  };

// Exponer función globalmente
window.mostrarToast = mostrarToast;

  // Crear el contenido HTML del toast
  toast.innerHTML = `
    <button class="toast-close" onclick="cerrarToast(this)">&times;</button>
    <div class="toast-header">
      <i class="toast-icon ${iconos[tipo] || iconos.success}"></i>
      <p class="toast-title">${titulo}</p>
    </div>
    <p class="toast-message">${mensaje}</p>
  `;

  // Añadir el toast al contenedor
  toastContainer.appendChild(toast);

  // Mostrar con animación después de un pequeño delay
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Auto-cerrar la notificación después de 4 segundos
  setTimeout(() => {
    cerrarToast(toast.querySelector(".toast-close"));
  }, 4000);
}

function cerrarToast(button) {
  // Encontrar el toast padre del botón
  const toast = button.closest(".toast-notification");
  
  // Agregar clase para animación de salida
  toast.classList.add("hide");

  // Remover el elemento del DOM después de la animación
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 400);
}

/* ========================================
   FIN DEL SCRIPT PRINCIPAL
   ======================================== */
