# Ahora

App móvil (Android) para trabajar en **bloques de cinco minutos**. Un solo propósito: que cinco minutos de trabajo real ocurrir de verdad, sin planificador, sin cuentas y sin historial.

La app no organiza tu vida. Te muestra tres tareas, arrancás un bloque de cinco minutos a mano, y cuando termina pasa lo que sigue. Lo que no hiciste no te persigue: no hay racha, no hay contador, no hay "ya cumpliste". El día que no hacés nada no deja rastro.

## Cómo funciona

- **Un bloque de 5 minutos**, arrancado a mano con el botón "Empezar". No hay hora fija ni arranque automático.
- **Lista cortísima**: máximo 3 tareas abiertas en pantalla. Sin categorías, sin prioridades, sin fechas límite, sin backlog que crezca.
- **Buzón**: captura libre, sin límite. Es de donde salen las tareas de hoy.
- **Siempre hay 3 filas**: al completar una, sube sola la más vieja del buzón.
- **Una sola marca** en toda la app: el puntito. Marcás una y la anterior pierde la marca. La marcada sube primero, aunque sea más nueva.
- **El bloque**: al llegar dice "Empezar"; al terminar el mismo botón dice "hecho". "Hecho" sólo existe en el bloque, así que marcar implica haber hecho los cinco minutos.
- **"Sacar de hoy"**: saca esa tarjeta de las tres y la devuelve al buzón.
- **Sin barra de progreso**: sólo el número. Cuando hacés algo no mirás el teléfono, así que una barra se lee de reojo o no se lee nunca.
- **Aviso al llegar a cero**: vibración más un sonido corto, porque el teléfono está boca abajo. El botón pasa a terracota como aviso secundario.

## Tech Stack

- **Framework:** React Native 0.88 + Expo SDK 58
- **React:** 19.3.0 (la que fija el SDK 58)
- **Lenguaje:** TypeScript
- **Routing:** Expo Router (file-based, stack)
- **Persistencia:** @react-native-asyncmstorage/async-storage (el buzón y el bloque corriendo sobreviven a que la app se cierre)
- **Notificaciones:** expo-notifications (el aviso local del final del bloque)
- **Haptics:** expo-haptics (los tics de "Empezar" y "hecho")
- **Iconos:** react-native-svg (trazados a mano desde el SVG de Penpot, no una librería de íconos)
- **Tipografía:** Inter Tight (OFL), empaquetada en `assets/fonts/` y cargada con expo-font
- **Safe area:** react-native-safe-area-context
- **Gestor de paquetes:** pnpm
- **Expo Go:** el Expo Go de la Play Store hoy corre SDK 57, así que para este proyecto hay dos caminos: el APK oficial de Expo Go 58 (rápido para iterar) o una dev build. La dev build hace falta igual, porque USE_EXACT_ALARM no se puede declarar desde Expo Go y sin eso la vibración del final del bloque llega cuando quiere.

## Sistema de diseño

Un solo color de acento. Fondo, tarjetas y bordes neutros; terracota para lo activo y para los errores.

| Rol              | Color     | Uso                                     |
| ---------------- | --------- | --------------------------------------- |
| Fondo            | #FAFAF8 | Fondo de la app                         |
| Tarjeta          | #FFFFFF | Fondo de las tarjetas y del campo       |
| Borde            | #E7E7E2 | Borde de tarjeta, borde de campo        |
| Texto            | #1A1A1A | Texto principal, fondo del toast        |
| Texto suave      | #8E8E88 | Texto secundario, íconos, tilde         |
| Acento terracota | #B4653A | Marca, botón, toast de error            |
| Acento suave     | #F6EAE3 | Fondos terracota                        |

**Tres pantallas.** *Ahora* (las tres tareas, campo para anotar, pastilla "Buzón" arriba a la derecha), *Bloque* (reloj de 5:00 y botón), *Buzón* (todo lo pendiente, ordenado solo, campo para anotar). Sin barra inferior. Los links de vuelta dicen "‹ Ahora".

**Íconos.** Sólo dos en toda la app, mismo grosor (1,5): *Sacar de hoy* (bandeja con flecha hacia adentro, #8E8E88) y *Hecho* (tilde). La prioridad es un puntito. No hay ícono de arranque.

**Avisos.** Una sola superficie: un toast que baja del borde superior, píldora de 40 px de alto y radio 20, tinta #1A1A1A con texto blanco para confirmaciones y terracota para errores. Los mensajes son "Anotada", "No se pudo guardar. Probá de nuevo." y "No te puedo avisar cuando termine."

**Icono de la app.** Cronómetro: aro terracota con la coronita despegada arriba y el punto al centro, sobre fondo crema #FAFAF8.

## Pantallas

Planeada. En Expo Router las rutas viven en src/app/, y todo lo demás fuera de ahí:

    src/
      app/
        _layout.tsx        -- raíz: SafeAreaProvider + ToastProvider
        index.tsx          -- Ahora
        bloque.tsx         -- Bloque
        buzon.tsx          -- Buzón
      components/          -- Tarjeta, CampoAnotar, Aviso, BarraSuperior
      icons/               -- Bandeja, Tilde, Chevron (react-native-svg)
      notifications/       -- canal de Android, aviso local, tarea en segundo plano
      state/               -- buzón, lista de 3, bloque corriendo, persistencia
      theme/               -- paleta, tipografía, espaciado

## Requisitos

- Node.js 24
- pnpm
- Android: para la dev build hace falta el SDK de Android y JDK 17.

## Documentación

- `decisiones.md` — la fuente de verdad del producto: cada decisión del diseño está anotada con el número y el motivo. Está en `.gitignore` y **no se versiona**: es un documento de trabajo, no parte del repo.
- El diseño vive en Penpot.

## Estado

En construcción. Hoy el repo tiene el README; la app todavía no está.
