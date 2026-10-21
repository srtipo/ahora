# Tema claro y oscuro
Creado: 2026-10-20

Continúa el registro de la app en `decisiones.md` (raíz del proyecto), donde están la 1 a la 40.

41. THEME SOLO COLORES: el theme es únicamente la paleta de colores; no toca tipografía ni espaciado. Hay dos variantes, light y dark.
42. EL TEMA LO MANDA EL SISTEMA: la app sigue el ajuste claro/oscuro del teléfono (useColorScheme, userInterfaceStyle "automatic" en app.json). No hay toggle manual en la app, que no tiene pantalla de ajustes.
*El toggle manual queda para más adelante si hace falta.*

43. LA PALETA: ocho tokens semánticos con dos variantes. Light conserva los valores de #8 (#FAFAF8, #FFFFFF, #E7E7E2, #1A1A1A, #8E8E88, #B4653A, #F6EAE3) y suma el onAccent #FFFFFF. Dark se ajusta a mano y no es la light invertida: #141413, #1E1E1C, #33322E, #F2F1EC, #8E8E88, #D3854F, #33211A y #1A1A1A.
*En dark el acento se aclara a #D3854F conservando el hue del terracota (~24°) y el texto sobre él pasa a oscuro. En light quedan dos pares justos y se aceptan a propósito: el blanco sobre terracota da 4,32:1 (el texto del botón tiene que ir en grande para que entre como texto grande) y el gris suave da 3,15:1 (es texto secundario: la tilde, el puntito y la tarea completada). En dark los ocho pares pasan AA.*

44. TOKENS SEMÁNTICOS, NO HEX SUELTOS: ninguna pantalla escribe un color, escribe tokens. Un único tipo Palette obliga a que light y dark tengan los mismos ocho. El provider lee useColorScheme() y reparte la paleta con useTheme(), y app.json queda en userInterfaceStyle "automatic". Sin librerías nuevas: expo-status-bar y expo-system-ui ya estaban, y el splash oscuro sale de la variante dark del plugin expo-splash-screen en app.json (#FAFAF8 de fondo en light, #141413 en dark).
