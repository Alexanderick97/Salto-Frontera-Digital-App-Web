# 🚀 Salto Frontera Digital

**Optimización del Cruce Fronterizo en el Paso Cardenal Samoré**

[![Figma](https://img.shields.io/badge/Figma-Prototipo-blue?logo=figma)](https://www.figma.com/make/m5Obm2ieDnJCbTBtVlYamC/App-Web-Salto-Frotera-Digital-Prototipo?fullscreen=1&t=hn6mML5kUwMbCUTY-1&code-node-id=0-9)
[![GitHub](https://img.shields.io/badge/GitHub-Repositorio-black?logo=github)](https://github.com/Alexanderick97/Salto-Frontera-Digital-App-Web)
[![Canva](https://img.shields.io/badge/Canva-Presentación-00C4CC?logo=canva)](https://canva.link/x49jg79dul8zfu4)

---

## 📖 Descripción del Proyecto

**Salto Frontera Digital** es una plataforma digital diseñada para reducir drásticamente los tiempos de espera en el paso fronterizo Cardenal Samoré (Chile-Argentina), que actualmente pueden alcanzar entre **8 y 20 horas en temporada alta**.

La solución propone un sistema donde los viajeros pueden completar todos los trámites aduaneros (registro de vehículo, declaración SAG, autorización de menores, mascotas y reserva de turno) de forma anticipada a través de una aplicación web. Una vez finalizados, el sistema genera un **código QR único** que permite una validación rápida en la ventanilla única de la aduana, integrando la información de Aduanas, PDI y SAG.

**Beneficio principal:** Reducir el tiempo de cruce a **menos de 10 minutos**.

---

## 🎯 Contexto del Caso

El Servicio Nacional de Aduanas de Chile enfrenta serios problemas de congestión en los pasos fronterizos terrestres, especialmente en el complejo Cardenal Samoré. Las principales causas son:

- Procesos manuales y duplicación de información entre organismos (Aduana, PDI, SAG).
- Falta de digitalización de trámites.
- Aumento del flujo vehicular (180% en temporada alta).
- Infraestructura limitada.

El proyecto busca modernizar los procesos aduaneros mediante la digitalización y automatización de los trámites, mejorando la experiencia de los viajeros y la eficiencia de los funcionarios públicos.

---

## 🛠️ Herramientas y Metodologías

| Herramienta/Metodología | Uso |
|--------------------------|-----|
| **Figma** | Prototipado interactivo de alta fidelidad (interfaz viajero, funcionario y administrador) |
| **Scrum** | Organización del trabajo en sprints y entregas incrementales |
| **Design Thinking** | Enfoque centrado en el usuario para comprender y validar necesidades reales |
| **GitHub** | Control de versiones y trabajo colaborativo |
| **Matriz de Control de Cambios** | Documentación estructurada de cada modificación realizada |

---

## 📋 Funcionalidades Implementadas

### Interfaz del Viajero (APP/Web)
- ✅ Registro de usuario con validación de identidad
- ✅ Registro de vehículo para salida temporal (180 días)
- ✅ Declaración Jurada digital para el SAG
- ✅ Autorización notarial para menores de edad
- ✅ Registro de mascotas con certificado sanitario
- ✅ Reserva de turno de cruce con calendario
- ✅ Generación de código QR único por trámite
- ✅ Consulta de estado de trámites

### Interfaz del Funcionario (Panel de Validación)
- ✅ Login institucional (Aduana, PDI, SAG)
- ✅ Escáner de código QR (simulado)
- ✅ Ventanilla única con pestañas por institución
- ✅ Aprobación/rechazo de trámites
- ✅ Solicitud de documentación adicional
- ✅ Registro de cruce (entrada/salida)

### Panel de Administrador
- ✅ Gestión de usuarios (superficial)
- ✅ Generación de reportes estadísticos (PDF/Excel simulado)

---

## 📐 Modelo de Calidad (ISO/IEC 25010)

El prototipo fue evaluado utilizando el estándar **ISO/IEC 25010**, considerando las siguientes características de calidad:

| Atributo | Implementación en el Prototipo |
|----------|--------------------------------|
| **Seguridad** | Roles diferenciados (viajero, funcionario, administrador). Autenticación y control de acceso. |
| **Accesibilidad** | Cumplimiento de WCAG 2.1 nivel AA: contraste 4.5:1, etiquetas ARIA, navegación por teclado. |
| **Eficiencia** | Tiempo de respuesta simulado < 3 segundos por interacción. |
| **Usabilidad** | Interfaces intuitivas, formularios guiados y navegación clara. |
| **Confiabilidad** | Flujo continuo sin errores y validaciones en tiempo real. |
| **Funcionalidad** | Todas las funciones requeridas para el proceso fronterizo. |
| **Mantenibilidad** | Diseño modular que facilita futuras mejoras. |

---

## 🧪 Plan de Pruebas

Se ejecutaron **18 casos de prueba** sobre el prototipo, cubriendo tanto caminos felices como alternativos. Los resultados fueron documentados en una matriz de casos de prueba, identificando:

- **13 PASS**: Funcionalidades que operan correctamente.
- **5 FAIL**: Áreas de mejora identificadas (ej. validación de documentos vencidos, gestión de cupos).

Los defectos encontrados fueron registrados como **DEF-01 a DEF-05** y quedarán como oportunidades de mejora para futuras iteraciones.

> **Nota:** Los FAIL no representan un fracaso, sino una oportunidad de mejora continua, alineada con la filosofía ágil y el control de versiones.

---

## 📦 Control de Versiones

El proyecto utiliza **versionado semántico (Major.Minor.Patch)** y está alojado en **GitHub**. La evolución del prototipo se documenta en una **Matriz de Control de Cambios**.

### Historial de Cambios (Resumen)

| Versión | Fecha | Cambio principal | Tipo |
|---------|-------|------------------|------|
| **V1.0.0** | 15/06/2026 | Creación inicial (login viajero) | Major |
| **V1.1.0** | 16/06/2026 | Módulo Declaración Jurada SAG | Minor |
| **V1.1.1** | 17/06/2026 | Corrección de máscara de entrada (solo permitía letra por letra) | Patch |
| **V1.2.0** | 18/06/2026 | Mejora de accesibilidad y diseño de interfaz | Minor |
| **V1.3.0** | 19/06/2026 | Módulo de reserva de turnos | Minor |
| **V1.4.0** | 20/06/2026 | Corrección de navegación entre pantallas | Minor |
| **V1.4.1** | 21/06/2026 | Checkbox "Recordar sesión" en login del viajero | Patch |
| **V2.0.0** | 29/06/2026 | Login de administrador + panel de reportes/gestión | Major |

> **Ver matriz completa:** [`MATRIZ CONTROL DE CAMBIO.xlsx`](https://github.com/Alexanderick97/Salto-Frontera-Digital-App-Web)

---

## 📂 Estructura del Repositorio

```text
Salto-Frontera-Digital-App-Web/
├── guidelines/
├── src/
│   ├── app/
│   ├── assets/
│   ├── imports/
│   └── main.tsx
├── index.html
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── vite.config.ts
└── README.md
```
---

## 🖥️ Prototipo Interactivo

El prototipo fue desarrollado en **Figma** y está disponible en el siguiente enlace:

👉 **[Ver Prototipo en Figma](https://www.figma.com/make/m5Obm2ieDnJCbTBtVlYamC/App-Web-Salto-Frotera-Digital-Prototipo?fullscreen=1&t=hn6mML5kUwMbCUTY-1&code-node-id=0-9)**

---

## 👥 Integrantes del Equipo

| Integrante | Rol |
|------------|-----|
| **Cindia Maldonado** | Project Manager / Analista de Calidad |
| **Erick Gonzales** | Arquitecto / Lead Developer |

---

## 📊 Presentación del Proyecto

La presentación final del proyecto está disponible en Canva:

👉 **[Ver Presentación](https://canva.link/x49jg79dul8zfu4)**

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la asignatura **Ingeniería de Software (RQY1102)** de Duoc UC.

---

## 📬 Contacto

Para cualquier consulta, puedes contactar a los integrantes del equipo a través del repositorio de GitHub.

---

**Salto Frontera Digital**  
*Paso Cardenal Samoré – Chile / Argentina*
