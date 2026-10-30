# Ahora

App móvil (Android) para trabajar en **bloques de cinco minutos**. Un solo propósito: que cinco minutos de trabajo real ocurrir de verdad, sin planificador, sin cuentas y sin historial.

La app no organiza tu vida. Te muestra tres tareas, arrancás un bloque de cinco minutos a mano, y cuando termina pasa lo que sigue. Lo que no hiciste no te persigue: no hay racha, no hay contador, no hay "ya cumpliste". El día que no hacés nada no deja rastro.

## Cómo funciona

- **Un bloque de 5 minutos**, arrancado a mano con el botón "Empezar". No hay hora fija ni arranque automático.
- **Lista cortísima**: máximo 3 tareas abiertas en pantalla. Sin categorías, sin prioridades, sin fechas límite, sin backlog que crezca.
- **Buzón**: captura libre, sin límite. Es de donde salen las tareas de hoy.
- **Siempre hay 3 filas**: al completar una, sube sola la más vieja del buzón.
- **Una sola marca** en toda la app: la teñida de terracota. Marcás una y la anterior pierde la marca. La marcada sube primero, aunque sea más nueva.
- **El bloque**: al llegar dice "Empezar"; cuando el contador arranca ese botón se va y aparece el "Hecho". "Hecho" sólo existe en el bloque, así que marcar implica haber hecho los cinco minutos.
- **"Sacar de hoy"**: saca esa tarjeta de las tres y la devuelve al buzón.
- **Sin barra de progreso**: sólo el número. Cuando hacés algo no mirás el teléfono, así que una barra se lee de reojo o no se lee nunca.
- **Aviso al llegar a cero**: vibración más un sonido corto, porque el teléfono está boca abajo. El botón pasa a terracota como aviso secundario.

## Tech Stack

- **Framework:** React Native 0.86 + Expo SDK 57
- **React:** 19.2.3 (la que fija el SDK 57)
- **Lenguaje:** TypeScript
- **Routing:** Expo Router (file-based, stack). Las rutas viven en `src/app/`
- **Alias:** `@/` → `src/`, por `paths` del `tsconfig.json` (los resuelve Expo
  solo, sin plugin de Babel)
- **Estado:** React Query (@tanstack/react-query): el loading y el cache, un hook por acción
- **Persistencia:** expo-sqlite (SQLite: el buzón, las tres y el bloque corriendo sobreviven a que la app se cierre)
- **Ids:** expo-crypto (UUID v4 de las tareas: el random sale del generador del sistema, no de `Math.random`)
- **Notificaciones:** expo-notifications (el aviso local del final del bloque)
- **Haptics:** expo-haptics (los tics de "Empezar" y "Hecho")
- **Gestos:** react-native-gesture-handler + react-native-reanimated (el swipe de "Sacar de hoy")
- **Iconos:** react-native-svg (trazados a mano desde el SVG de Penpot, no una librería de íconos)
- **Degradado:** expo-linear-gradient (la banda donde la lista se disuelve al llegar al campo)
- **Tipografía:** Inter Tight (OFL), empaquetada en `assets/fonts/` y cargada con expo-font
- **Safe area:** react-native-safe-area-context
- **Gestor de paquetes:** pnpm
- **Expo Go:** el Expo Go de la Play Store hoy corre SDK 57, así que para este proyecto hay dos caminos: el APK oficial de Expo Go 57 (rápido para iterar) o una dev build. La dev build hace falta igual, porque USE_EXACT_ALARM no se puede declarar desde Expo Go y sin eso la vibración del final del bloque llega cuando quiere.

## Sistema de diseño

Un solo color de acento. Fondo, tarjetas y bordes neutros; terracota para lo activo y para los errores.

| Rol              | Color     | Uso                                     |
| ---------------- | --------- | --------------------------------------- |
| Fondo            | #FAFAF8 | Fondo de la app                         |
| Tarjeta          | #FFFFFF | Fondo de las tarjetas y del campo       |
| Fila del buzón   | #F2F2EF | Fondo de las filas del buzón            |
| Borde            | #E7E7E2 | Borde de tarjeta, borde de campo        |
| Texto            | #1A1A1A | Texto principal, fondo del toast        |
| Texto suave      | #8E8E88 | Texto secundario, íconos, tilde         |
| Texto hecho      | #B5B5AD | Texto de la tarea completada            |
| Acento terracota | #B4653A | Borde y fondo de la marcada, botón     |
| Acento suave     | #F6EAE3 | Fondos terracota                        |

**Tarjetas.** Dos familias, con escalas distintas:

| Componente            | Alto | Radio | Texto  | Padding | Estados                        |
| --------------------- | ---- | ----- | ------ | ------- | ------------------------------ |
| `TaskCard` (Ahora)    | 64   | 12    | 16 px  | 40      | normal · marcada · completada  |
| `InboxItem` (Buzón)   | 48   | 10    | 14 px  | 16      | normal · marcado               |

Ninguna tiene ancho propio: las dos se estiran al ancho de la lista, así que el mismo componente sirve en cualquier pantalla. El alto es un mínimo, para que una tarea con texto largo crezca en vez de cortarse. La marcada se tiñe de terracota suave con borde terracota; la completada conserva la tarjeta con el texto en gris y lleva la tilde a la derecha. Ninguna lleva puntito: el color basta para decir cuál es la marcada, y el texto queda siempre en el mismo lugar.

**Sacar de hoy.** Arrastrar la tarjeta a la derecha la saca de la lista: en el hueco que deja aparece la bandeja. El gesto vive en la tarjeta, pero no decide qué pasa: avisa con `onSwipeOut` y la pantalla hace el resto. Umbral: 100 px.

**Tres pantallas.** *Ahora* (las tres tareas, campo para anotar, pastilla "Buzón" arriba a la derecha), *Bloque* (reloj de 5:00 y botón), *Buzón* (todo lo pendiente, ordenado solo, campo para anotar). Sin barra inferior. Los links de vuelta dicen "‹ Ahora".

El campo del *Buzón* vive fuera del scroll, arriba de la lista: sólo las tareas scrollean, así que anotar es posible con la lista larga. En el *Ahora* el campo sí va dentro, porque la lista son tres y no hay nada que scrollear.

El hueco entre el campo y la primera tarea del buzón no está vacío: es una banda de 24 px con un degradado (expo-linear-gradient) que va del fondo de la app al fondo transparente. La lista pasa por debajo del campo y se disuelve ahí, en vez de cortarse justo en su borde. La banda es siempre la misma: no aparece ni desaparece, sólo cambia lo que hay debajo. El hueco es el que deja el diseño; el degradado lo hace transición.

**Íconos.** Tres, en `src/presentation/icons/`: *Sacar de hoy* (`Tray`, bandeja con flecha hacia adentro, #8E8E88), *Hecho* (`Check`, tilde) y el chevron del *‹ Ahora* (`Chevron`). Los tres son de trazo y tienen el mismo grosor (1,5). No hay ícono de arranque. La bandeja no se dibuja adentro de la tarjeta: se inyecta como dependencia (`tray={Tray}`), igual que el botón recibe su ícono. La tilde de la tarea completada, en cambio, es parte de la propia tarjeta.

**Avisos.** Una sola superficie: un toast que baja del borde superior, píldora de 40 px de alto y radio 20, tinta #1A1A1A con texto blanco para confirmaciones y terracota para errores. Los mensajes son "Anotada", "No se pudo guardar. Probá de nuevo." y "No te puedo avisar cuando termine." El aviso no se lleva el foco: los botones de la app no lo toman (la app es de dedo), así que el sistema no les dibuja el anillo de foco encima cuando el aviso aparece.

**Icono de la app.** Cronómetro: aro terracota con la coronita despegada arriba y el punto al centro, sobre fondo crema #FAFAF8.

## La organización de los archivos

Cuatro capas, y cada una en su carpeta. La decisión 47 del `decisiones.md` está el motivo de cada una.

    src/
      app/                  -- sólo ruteo: los archivos de Expo Router
        _layout.tsx           -- raíz: SafeAreaProvider + ThemeProvider + QueryClientProvider + ToastProvider
        index.tsx             -- Ahora → re-export de modules/now/presentation/screens/now.screen
        buzon.tsx            -- Buzón → re-export de modules/stack/presentation/screens/stack.screen
        clock.tsx            -- Bloque → re-export de modules/clock/presentation/screens/clock.screen
      modules/              -- un módulo por funcionalidad
        now/                  -- la pantalla de Ahora
          hooks/                 -- un hook por accion del core
            useGetNowTasks.ts
            useGetNowTasksDoneToday.ts
          presentation/
            components/now-task-list.tsx
            screens/now.screen.tsx
        stack/                -- la pantalla del Buzón
          hooks/                 -- un hook por accion del core
            useGetStackTasks.ts
          presentation/
            components/stack-task-list.tsx
            screens/stack.screen.tsx
        clock/               -- la pantalla del Bloque
          hooks/                 -- un hook por accion del core
            useCompleteNowTask.ts
            useGetNowTask.ts
          presentation/
            components/done-button.tsx
            screens/clock.screen.tsx
      core/                 -- el API del dominio: las reglas y la base
        index.ts              -- el barril: lo que la app puede importar
        types.ts              -- las tareas de now y del buzón
        dates.ts              -- los helpers de fecha
        ids.ts                -- los ids de las tareas (UUID v4)
        db/                   -- SQLite: la base, la forma y las migraciones
          index.ts              -- el barril
          database.ts           -- la conexión y las migraciones
          executor.ts           -- lo que corre una consulta: la base o una transacción
          migrations.ts         -- las migraciones, en orden
          schema.ts             -- la forma de la base
        now/                  -- las reglas de las tareas de ahora
          index.ts
          addNowTask.handler.ts
          completeNowTask.handler.ts
          getNowTask.handler.ts
          getNowTasks.handler.ts
          getNowTasksDoneToday.handler.ts
          repository.ts         -- el SQL de las tareas de ahora
        stack/                 -- el buzón: las tareas que todavía no entraron
          index.ts
          addStackTask.handler.ts
          getStackTasks.handler.ts
          repository.ts         -- el SQL de las tareas del buzón
      presentation/         -- la UI base, por tipo de componente
        buttons/              -- Button, PillButton, BackLink, Spinner
        cards/                -- TaskCard, InboxItem
        fields/               -- TextField
        icons/                -- Icons: Tray, Check, Chevron
        pressable.ts          -- los props que sacan a un boton del foco
        toasts/               -- Toast, ToastProvider
        timers/               -- Countdown
      theme/                -- los tokens
        colors.ts, fonts.ts, ThemeProvider.tsx

Tres reglas:

- **Dentro de una carpeta, ruta relativa. Entre carpetas, el alias `@/`.** Lo de
  afuera de `src/` no usa rutas relativas: `"@/presentation/cards"`.
- **Cada carpeta que se importa desde afuera tiene su `index.ts`.** El barril
  es la puerta, y adentro se importa del archivo.
- **`core/` no importa de `modules/` ni de `presentation/`.** Las reglas no
  saben de React; el orden va de afuera hacia adentro: app → modules →
  presentation/theme, y app → core → nada.

La capa de presentación se ordena por **tipo de componente** y no por
pantalla, porque un componente que se usa en dos pantallas no puede vivir en
una de las dos. La de módulos se ordena por **funcionalidad**, y adentro la
pantalla vive en `presentation/screens/`.

## El estado

Una base, dos tablas y un módulo: el estado vive en SQLite y las reglas en
`src/core/`, así que las pantallas sólo dibujan lo que el módulo devuelve.

El estado llega a las pantallas con React Query: cada acción del core tiene
un hook en la carpeta `hooks/` de su módulo (`modules/now/hooks/`), y ese hook llama a la
función del core que busca los datos. React Query maneja el loading y la
cache, así que ninguna pantalla dibuja un estado vacío mientras carga.

La base tiene dos tablas. `now_tasks` es la lista de tareas de ahora y
`stack_task` es la pila de las que todavía no entraron. La tarea de now es
`{id, name, status, marked, createdAt}` y las completadas le suman
`completedAt`. El `status` dice si está para hacer ("todo"), en curso
("inProgress") o completada ("done"), y `marked` dice si la tarea se ve
resaltada.

La base es la que valida: la tabla no acepta un texto vacío, ni un estado que
no sea uno de los tres, ni una marca que no sea 0 o 1, ni dos tareas con el
mismo id. Un valor roto no puede llegar a la app, porque la base no lo deja
existir.

### La forma de la base

`src/core/db/schema.ts` tiene el DDL y `src/core/db/migrations.ts` las
migraciones, en orden. La versión vive en la base (`PRAGMA user_version`), así
que viaja con los datos: una migración y el número que dice que corrió son una
sola transacción, y si la app muere en el medio la base se queda en la versión
que tenía y la migración corre otra vez desde el principio.

Las reglas:

- **La completada de hoy va primero.** La lista de ahora muestra las tareas
  completadas hoy arriba y las demás después, sin nada que las separe.
- **La marcada va primero.** En la lista de ahora, la marcada va arriba
  aunque sea la más nueva, y las demás van de la más vieja a la más nueva.
- **La marca es de la tarea.** La que sale de las tres al buzón conserva la
  suya, porque cambiar de tabla no cambia la tarea. Por ahora puede haber
  más de una marcada: la marca única llega con la acción de marcar (el
  toque largo del buzón), que todavía no está.
- **El buzón se ordena solo.** Sus tareas (la tabla `stack_task`) se leen con
  el mismo orden: la marcada primero, aunque sea la más nueva, y las demás de
  la más vieja a la más nueva. El buzón se lee y se escribe: lo que se anota
  en su campo entra en `stack_task`, sin marcar, y también entra lo que sale
  de las tres.
- **Lo que está `done` sale de la lista.** Deja de ser una tarea de ahora, pero
  queda guardada, con el momento en que se completó.
- **Al completar, sube la más vieja del buzón.** La tarea que se hace queda
  guardada con su momento, y el lugar que deja libre lo toma la del buzón que
  más tiempo lleva esperando (o la marcada, si hay una). La que sube se muda:
  conserva su id, su marca y su edad. Las dos escrituras van en la misma
  transacción, así que no hay un momento en que la tarea esté en las dos
  tablas ni en ninguna.
- **Siempre hay tres abiertas.** Cuando entra una cuarta, deja la tabla la
  que menos importa: la que no está marcada y, entre las que no lo están, la
  más nueva. La tarea que sale va al buzón: se escribe en `stack_task` y se
  borra de `now_tasks`, todo en la misma transacción, así que no hay un
  momento en que esté en las dos tablas ni en ninguna. Conserva su marca: la
  marca es de la tarea y no de la lista, así que cambiar de tabla no la
  pierde, y una tarea marcada puede estar esperando en el buzón.
- **La marca es un booleano.** No es un estado: la tarea sigue siendo la que
  es y además se ve resaltada.
- **La base es la que valida.** Cada consulta va por un índice o por la
  tabla entera, y la tabla entera es corta.

## Requisitos

- Node.js 24
- pnpm
- Android: para la dev build hace falta el SDK de Android y JDK 17.

## Documentación

- `decisiones.md` — la fuente de verdad del producto: cada decisión del diseño está anotada con el número y el motivo. Está en `.gitignore` y **no se versiona**: es un documento de trabajo, no parte del repo.
- El diseño vive en Penpot.

## Estado de la app

En construcción. Hoy están la pantalla de *Ahora* (las tareas de now, las
completadas de hoy arriba y el campo para anotar), la pantalla del *Buzón* (las
tareas que todavía no entraron y su campo), el sistema de diseño y el estado
con su persistencia en SQLite. El modelo es `now_tasks` + `stack_task`. Los
dos campos anotan y la regla de las tres está en el core: la que no entra va al
buzón. La pantalla del *Bloque* tiene el nombre de la tarea, el contador y el
botón "Empezar": apretarlo arranca la cuenta atrás de los cinco minutos. En
cuanto el contador arranca aparece el botón "Hecho": el de completar la tarea,
que la da por hecha y hace subir la más vieja del buzón. El reloj todavía vive
en la pantalla, así que no sobrevive a que la app se cierre: faltan el
timestamp de arranque en la base y el aviso del final.