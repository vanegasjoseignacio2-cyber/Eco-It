# Guía de Pruebas: Misiones y Panel de Administración del Eco-Juego

Esta guía detalla exclusivamente los pasos para probar de forma **manual** el sistema de misiones (logros) para los jugadores y el Panel de Administración del juego.

---

## 🎯 1. Pruebas del Sistema de Misiones (Jugador)

Las misiones son retos configurados por los administradores (ej. recolectar una cierta cantidad de residuos, mantener una racha específica o jugar cierta cantidad de veces) que, al completarse, otorgan puntos extra a los jugadores.

- [ ] **Desbloqueo de Misión en el Juego:** 
  1. Inicia sesión con una cuenta de jugador normal y entra a la página del juego.
  2. Antes de jugar, revisa en tu sección de "Logros" qué misión tienes pendiente por cumplir.
  3. Juega una partida procurando alcanzar exactamente esa condición (por ejemplo, alcanzar una racha máxima de 5).
  4. Al perder la partida y terminar, la pantalla de resultados emergente debería notificarte explícitamente que has desbloqueado la misión y mostrar los puntos extra que te ha otorgado.
- [ ] **Actualización Automática:** 
  1. Tras cerrar la notificación de resultados, desplázate hacia abajo en la misma página.
  2. Verifica que, sin tener que recargar la página manualmente, la misión recién cumplida aparezca ahora marcada como completada en tu lista de Logros.
  3. Revisa la tabla del **Ranking**; tu puntaje total debería haber aumentado automáticamente reflejando tanto los puntos de la partida como los puntos extra por la misión.

---

## ⚙️ 2. Pruebas del Panel de Administración (Admin Eco-Juego)

El Panel de Administración del Eco-Juego es una interfaz exclusiva para cuentas con rol `admin` donde pueden gestionar completamente las misiones del juego y visualizar estadísticas globales.

### Pruebas de Visualización (Dashboard)
- [ ] **Indicadores Generales:** Ingresa al panel de administración del Eco-juego y verifica que se carguen correctamente los indicadores superiores: Total de Misiones, Misiones Activas, Jugadores Totales y Puntos Promedio.
- [ ] **Ranking Global:** En la parte lateral derecha, revisa que se cargue la lista completa de los mejores jugadores, verificando que los líderes tengan su medalla asignada (🥇, 🥈, 🥉) y se muestre su cantidad de misiones completadas.

### Pruebas de Gestión de Misiones (CRUD)
- [ ] **Crear una Misión:** 
  1. Haz clic en el botón "Nueva Misión".
  2. Completa los campos: Título, Descripción, Categoría, Puntos de recompensa y las Condiciones de desbloqueo (qué parámetro medir y cuánto).
  3. Revisa el cuadro inferior de "Vista previa" para asegurar que la condición redactada tiene sentido.
  4. Guarda los cambios. La nueva misión debe aparecer de inmediato en el listado de la izquierda y mostrar un mensaje de éxito en pantalla.
- [ ] **Editar una Misión:** 
  1. Identifica una misión en la lista y haz clic en su botón de editar (lápiz).
  2. Modifica la cantidad de puntos que otorga y guarda los cambios.
  3. Verifica que la tarjeta de la misión en la lista se actualice inmediatamente con el nuevo valor.
- [ ] **Activar/Desactivar Misión:** 
  1. En la lista de misiones, haz clic en el interruptor (toggle) de una misión activa. 
  2. El interruptor debería apagarse y la tarjeta tornarse semi-transparente o con borde gris. 
  3. **Prueba cruzada:** Entra a la cuenta de un jugador normal y comprueba que esa misión ya no le aparece listada.
- [ ] **Eliminar una Misión:** 
  1. Haz clic en el icono de papelera de una misión de prueba que hayas creado.
  2. Debería saltar una ventana de confirmación centrada pidiendo ratificar la acción (para evitar borrados accidentales).
  3. Confirma la eliminación y verifica que la tarjeta desaparezca definitivamente del listado administrativo.
