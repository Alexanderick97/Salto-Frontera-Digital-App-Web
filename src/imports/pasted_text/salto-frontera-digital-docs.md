Contexto del proyecto:
"Salto Frontera Digital" es una plataforma digital que busca reducir los tiempos de espera en el paso fronterizo Cardenal Samoré (Chile-Argentina) de 8-20 horas a menos de 10 minutos. Permite a los viajeros registrar anticipadamente sus trámites (vehículo, declaración SAG, autorización de menores, mascotas, reserva de turno) y a los funcionarios (Aduana, PDI, SAG) validar toda la información en una ventanilla única mediante un código QR. El sistema debe ser intuitivo, accesible y eficiente, con dos interfaces diferenciadas: una para el viajero (APP/Web responsive) y otra para el funcionario (Web para tablet/PC). También se incluye un panel de administrador con funcionalidades superficiales de reportes y gestión de usuarios.

Paleta de colores:
- #283D3B (verde oscuro) – para encabezados, barras de navegación y elementos principales.
- #197278 (verde azulado) – para botones primarios, enlaces y acentos.
- #EDDDD4 (beige claro) – para fondos de pantalla y áreas de contenido.
- #C44536 (rojo) – para alertas, mensajes de error y acciones de peligro.
- #772E25 (rojo oscuro) – para texto de alertas y elementos destacados (ej. fechas límite).
Usa esta paleta de forma equilibrada, adaptando los tonos para cada interfaz según el contexto (por ejemplo, el panel del funcionario puede tener más énfasis en el verde oscuro para transmitir seriedad y control).

Tipografía: Sans-serif (Roboto, Inter o similar) para legibilidad en pantallas.

---

### INTERFAZ 1: APP/WEB DEL VIAJERO (Responsive, prioridad móvil)

**Pantalla 1: Login / Registro**
- Formulario de login: email, contraseña, botón "Iniciar sesión". Enlace "¿Olvidaste tu contraseña?".
- Enlace "Registrarse" que lleva a formulario de registro con: nombre, apellido, RUT/pasaporte, email, contraseña, confirmar contraseña, aceptar términos y condiciones. Botón "Crear cuenta".
- Mensajes de validación en campo (ej. "Email inválido", "Contraseña debe tener 8 caracteres").

**Pantalla 2: Dashboard del viajero**
- Menú principal con íconos grandes y texto: "Registrar vehículo", "Declaración SAG", "Autorización de menores", "Declarar mascota", "Reservar turno", "Mis trámites" (estado), "Código QR".
- Barra de estado que muestra el progreso del trámite: "Completa tus trámites antes de cruzar" y un indicador de pasos completados.
- Botón de accesibilidad: "Alto contraste" (simulado, que cambiará la paleta a una versión con mayor contraste en el diseño).

**Pantalla 3: Registrar vehículo**
- Formulario: patente (con máscara), marca, modelo, año (selector numérico), país de registro (selector desplegable).
- Botón "Guardar y continuar".
- Al guardar, mostrar mensaje de éxito y opción de imprimir formulario (simulado con un botón "Imprimir" que genera un PDF visual).

**Pantalla 4: Declaración SAG**
- Pregunta: "¿Portas productos animales o vegetales?" con opciones Sí/No (radio buttons).
- Si selecciona Sí, se despliega una lista de categorías (frutas, verduras, carnes, lácteos, etc.) con checkbox para marcar.
- Botón "Adjuntar documentación" (simulado para subir archivo).
- Botón "Enviar declaración".

**Pantalla 5: Autorización de menor**
- Datos del menor: nombre, RUT, fecha de nacimiento (selector).
- Botón "Adjuntar autorización notarial" (simulado subir archivo).
- Botón "Registrar autorización".

**Pantalla 6: Declarar mascota**
- Datos: tipo (perro/gato/otro), nombre, raza, edad.
- Botón "Adjuntar certificado sanitario y vacunas" (simulado subir archivo).
- Botón "Registrar mascota".

**Pantalla 7: Reservar turno**
- Calendario con fechas disponibles (marcadas en verde) y horarios (mañana, tarde, noche).
- Selector de fecha y hora.
- Botón "Reservar turno".
- Mensaje de confirmación con datos de la reserva.

**Pantalla 8: Mis trámites (estado)**
- Lista de trámites realizados con su estado: "Aprobado" (verde), "Pendiente" (amarillo), "Rechazado" (rojo).
- Cada trámite tiene un botón "Ver QR" para acceder al código QR asociado.
- Estado global del viajero: si todos los trámites están aprobados, mostrar "Listo para cruzar".

**Pantalla 9: Código QR**
- Código QR grande con el número de trámite y fecha de expiración.
- Botón "Descargar QR" (simulado).
- Botón "Volver al dashboard".

**Navegación:**
- El viajero puede navegar libremente entre pantallas usando el menú inferior (en móvil) o lateral (en tablet/PC).
- En cada formulario hay un botón "Volver" para regresar al dashboard sin perder datos (los datos se guardan automáticamente al avanzar).

---

### INTERFAZ 2: WEB DEL FUNCIONARIO (Optimizado para tablet/PC)

**Pantalla 1: Login funcionario**
- Formulario: usuario (email), contraseña.
- Botón "Ingresar".
- Opción de "Recordar sesión" (checkbox).

**Pantalla 2: Panel de validación (ventanilla única)**
- Barra superior: logo, nombre del funcionario, institución (Aduana/PDI/SAG según el rol), botón "Cerrar sesión".
- Área central: recuadro con simulación de cámara para escanear QR y un campo de texto para ingresar manualmente el código.
- Al escanear/ingresar código, se despliega la información del viajero en pestañas:
  - **Pestaña "Aduana"**: Datos del viajero (nombre, RUT/pasaporte), vehículo registrado (patente, marca, modelo), autorización de menor (si aplica), mascota (si aplica). Cada ítem con su estado (aprobado/rechazado/pendiente).
  - **Pestaña "PDI"**: Antecedentes migratorios con simulación de "Sin alertas" o "Alerta" con ícono.
  - **Pestaña "SAG"**: Declaración jurada con productos declarados y certificados adjuntos (visibles como lista de archivos).
- Botones de acción inferiores:
  - "Aprobar todo" (verde): cambia estado a aprobado y permite continuar.
  - "Rechazar" (rojo): abre diálogo para indicar motivo (seleccionable de lista).
  - "Solicitar documentación adicional" (amarillo): abre un campo para escribir mensaje y enviar al viajero (simulado).
- Cuando todos los trámites están aprobados, aparece un botón "Registrar cruce" que genera un comprobante final con número de cruce y fecha, y simula el envío de un email de confirmación al viajero (con una notificación en pantalla: "Se ha enviado el comprobante al correo del viajero").

**Pantalla 3: Panel de administrador (funcionalidad superficial)**
- Acceso desde el login con credenciales de administrador.
- Menú: "Reportes" y "Gestión de usuarios".
- **Reportes**: Filtros de fecha y tipo (personas/vehículos). Botón "Generar reporte" que muestra una vista previa en tabla y opciones de descarga PDF/Excel (simulado, solo el botón).
- **Gestión de usuarios**: Lista de usuarios con opciones de editar, bloquear, eliminar (solo diseño, sin funcionalidad real).

**Navegación:**
- Flujo lineal: login → escanear QR → validar → registrar cruce → volver al panel.
- El funcionario puede volver al escáner desde cualquier punto con un botón "Nuevo escaneo".
- El administrador tiene menú lateral para navegar entre Reportes y Gestión.

---

### Accesibilidad (simulada en el diseño)
- **Contraste**: La paleta base cumple con WCAG 2.1 AA (relación de contraste 4.5:1). Se incluye un botón "Alto contraste" en la interfaz del viajero que, al activarse, cambia los colores a una versión de mayor contraste (fondo blanco, texto negro, botones con bordes gruesos). En Figma, esto se simula con un estado alternativo de la pantalla.
- **Etiquetas ARIA**: En todos los botones y campos se incluye texto descriptivo (ej. "Escáner QR - Apunta la cámara al código").
- **Navegación por teclado**: Se simula visualmente con un borde de foco (outline) en todos los elementos interactivos al hacer clic/tab.
- **Tamaño de texto**: Ajustable mediante el zoom del navegador; los botones tienen altura mínima de 44px.

---

### Objetivo del prototipo
- Alta fidelidad: colores, tipografía, espaciado, íconos y elementos visuales realistas.
- Navegable: todas las pantallas deben estar conectadas mediante interacciones (clics) que simulen el flujo completo.
- Representar todas las funcionalidades descritas: registro, vehículo, SAG, menores, mascotas, turno, QR, validación en frontera, reportes y gestión de usuarios (superficial).
- Servir como base para pruebas de usuario y validación de requisitos funcionales y no funcionales (usabilidad, accesibilidad, eficiencia).

**Entregable esperado:** Archivo de Figma con todas las pantallas y conexiones, listo para ser compartido y editado.