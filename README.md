# Trabajo1-AGM
Breakout para trabajo 1 de AGM

Este proyecto consiste en una versión en 3D del juego BreakOut, en el cual se tiene una pala junto a una bola y con la combinación de los dos elementos tenemos que eliminar todos los bloques que hay en la parte superior del tablero. 
La manera de funcionar es muy sencilla, una vez iniciamos el juego con la URL:
http://personales.alumno.upv.es/vicaspue/webgl/paginapersonal.html
pulsamos la tecla Espacio para empezar a jugar, con las flechas de izquierda y derecha movemos la pala de la parte inferior para que la pelota pueda rebotar, si no rebota sobre la pala, el juego se detiene y muestra una señal de GAME OVER. 
Cuando eliminamos todos los bloques que hay en la parte superior, el juego termina avisándonos con un cartel de HAS GANADO. 
Si se quiere reiniciar el juego, pulsaremos la tecla R aunque esta solo funciona cuando aparecen los carteles de GAME OVER o de HAS GANADO. 
El escenario tiene un montón de detalles, en la parte superior izquierda nos muestra la puntuación que tenemos en base a los bloques que hemos eliminado. Si nos fijamos tenemos 3 luces, una luz general ambiental, una luz focal que enfoca al tablero principal y una luz que emite la propia bola. 
Como podemos ver la barra de la pala solo se mueve entre los limites del tablero y cuando la bola toca un ladrillo superior, lo elimina, pero no elimina ningún marco cuando impacta con él. 
No he utilizado ningún motor de gráficas, solo Threejs y Webgl, todos los movimientos y las detecciones de colisiones están detectadas en base a la posición (X,Y) de cada uno de los elementos, así como el movimiento de la bola. 
Lo que mas ha costado ha sido la eliminación de los bloques al colisionar con la bola, ya que al principio, no los eliminaba, sino que solo rebotaba, pero lo hemos conseguido mediante acceder a los elementos de scene y eliminar de ahí directamente cada uno de los cubos a los que toca la bola. 
El código está disponible en la siguiente dirección:
https://github.com/vicpue/Trabajo1-AGM/tree/develop
