/*
**Tranajo #1: Breakout Game
**@author: vicaspue@alumno.upv.es
**@date: 02-03-2020
*/


// Variables globales estandar

var renderer, scene, camera;

//Otras Variables
var angulo = 0;
var conjunto;
var colorMarco = 0x0C7C7C;

//marco 
var SupInf = 23;
var Lateral = 18;

init();
loadScene();
render();

function init() {
     //Motor de render
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth,window.innerHeight);
     renderer.setClearColor(new THREE.Color(0x000000))
     document.getElementById('contenedor').appendChild(renderer.domElement);
      
     //Escena
     scene = new THREE.Scene();
 
     //Camara
     var aspectRatio = window.innerWidth/window.innerHeight;
     camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 100);
     //camera = new THREE.OrthographicCamera(-10,10,10/aspectRatio,-10/aspectRatio,0.1,100); //Camara aortografica
     camera.position.set(0, 4, 40);
     camera.lookAt(new THREE.Vector3(0,0,0) );

      //Control de camera
      cameraControls = new THREE.OrbitControls(camera,render.domElement);
      cameraControls.target.set(0,0,0);
      cameraControls.noZoom = false;

     //Atender a eventos
     window.addEventListener('resize',updateAspectRatio);
}






function loadScene() {
  //Construye el grafo de escena
  // - Objetos (geometria, material)
  // - Transformaciones
  // - Organizar el grafo

  conjunto = new THREE.Object3D();
  conjunto.position.x= 0;
  conjunto.position.y = 0;

  //Cubo 

  var geoCubo = new THREE.BoxGeometry(6, 0.5, 0.5);
  var matCubo = new THREE.MeshBasicMaterial({ color: 0xB0FCFC});
  var cubo = new THREE.Mesh(geoCubo, matCubo);
  cubo.position.x = 0;
  cubo.position.y = -SupInf + 3;

  //MARCO INFERIOR - SUPERIOR
  var geoMarcoInferior = new THREE.BoxGeometry(34,1,1);
  var matMarcoInferior = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoInferor = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoInferor.position.y = -SupInf;

  var marcoSuperior = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoSuperior.position.y= SupInf;

  //MARCO LATERAL DERECHO - IZQUIERDO
  
  var geoMarcoLateral = new THREE.BoxGeometry(1,43,1);
  var matMarcoLateral = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoLateralDerecho = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralDerecho.position.x = Lateral;

  var marcoLateralIzquierdo = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralIzquierdo.position.x = -Lateral;

  //Grafo
  conjunto.add(marcoInferor);
  conjunto.add(marcoSuperior);
  conjunto.add(marcoLateralDerecho);
  conjunto.add(marcoLateralIzquierdo);
  conjunto.add(cubo);
 // scene.add(new THREE.AxesHelper(3));
  scene.add(conjunto);  
}

function update(){
  //Cambiar propeidadeas entre frames
  angulo += Math.PI/10;
  //esfera.rotation.y = angulo;
  //conjunto.rotation.y = angulo/10;
}

function render() {
  // Bucle de refresco
  requestAnimationFrame(render);
  update();
  renderer.render(scene, camera);
}

function updateAspectRatio(){
  //Mantener la relacion de aspecto entre marco y camara
    var aspectRatio=window.innerWidth/window.innerHeight;
    //Renovar medidas de viewport
    renderer.setSize(window.innerWidth, window.innerHeight);
    //Para la perspectiva
    camera.aspect = aspectRatio;
    //Para la Ortografica
   // camera.top = 10/aspectRatio;
    //camera.bottom = -10/aspectRatio;
  
    camera.updateProjectionMatrix();
  
  
  }
 