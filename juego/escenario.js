/*
**Seminario #1: Grafo de escena
**@author: daflobar@alumno.upv.es
**@date: 19-02-2020
*/

// Variables globales estandar

var renderer, scene, camera;

//Otras Variables
var angulo = 0;
var conjunto;
var colorMarco = 0x0C7C7C;

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
     camera.position.set(0, 0, 20);
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
  var geoCubo = new THREE.BoxGeometry(5, 0.5, 0.5);
  var matCubo = new THREE.MeshBasicMaterial({ color: 0xB0FCFC});
  var cubo = new THREE.Mesh(geoCubo, matCubo);
  cubo.position.x = 0;
  cubo.position.y = -11;

  //MARCO INFERIOR - SUPERIOR
  var geoMarcoInferior = new THREE.BoxGeometry(28,0.5,1);
  var matMarcoInferior = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoInferor = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoInferor.position.y = -14;

  var marcoSuperior = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoSuperior.position.y=14;


  //MARCO LATERAL DERECHO - IZQUIERDO
  
  var geoMarcoLateral = new THREE.BoxGeometry(0.5,28,1);
  var matMarcoLateral = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoLateralDerecho = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralDerecho.position.x = 15;

  var marcoLateralIzquierdo = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralIzquierdo.position.x = -15;

  
  //Grafo
  conjunto.add(marcoInferor);
  conjunto.add(marcoSuperior);
  conjunto.add(marcoLateralDerecho);
  conjunto.add(marcoLateralIzquierdo);
  conjunto.add(cubo);
  scene.add(new THREE.AxesHelper(3));
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
