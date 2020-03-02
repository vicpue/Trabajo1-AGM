/*
**Seminario #1: Grafo de escena
**@author: daflobar@alumno.upv.es
**@date: 19-02-2020
*/

// Variables globales estandar

var renderer, scene, camera;

//Otras Variables
var angulo = 0;
var esfera;
var conjunto;

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
     camera.position.set(0.5, 2, 5);
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
  conjunto.position.y = 1;

  //Cubo 
  var geoCubo = new THREE.BoxGeometry(2, 2, 2);
  var matCubo = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true });
  var cubo = new THREE.Mesh(geoCubo, matCubo);
  cubo.position.x = 2;

  //Esfera
  var geoEsfera = new THREE.SphereGeometry(1, 30, 30);
  var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
  esfera = new THREE.Mesh(geoEsfera, material);

  //Suelo
  var geoSuelo = new THREE.PlaneGeometry(10, 10, 12, 12);
  var matSuelo = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false });
  var suelo = new THREE.Mesh(geoSuelo, matSuelo);
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = -0.1;

  //Grafo
  conjunto.add(cubo);
  cubo.add(esfera);
  scene.add(conjunto);
  scene.add(new THREE.AxesHelper(3));
  scene.add(suelo);

  // Objeto importado
  var loader = new THREE.ObjectLoader();
  loader.load('models/Mario/mario-sculpture.json',
    function (objeto) {
      objeto.scale.set(0.01, 0.01, 0.01);
      objeto.rotation.y = Math.PI / 2;
      cubo.add(objeto);
    });

  // Texto

  var fontLoader = new THREE.FontLoader();
  fontLoader.load('fonts/gentilis_bold.typeface.json',
    function (font) {
      var geoTexto = new THREE.TextGeometry(
        'MARIO', {
        size: 0.5,
        height: 0.1,
        curveSegments: 3,
        style: "normal",
        font: font,
        bevelThickness: 0.05,
        bevelSize: 0.04,
        bevelEnabled: true
      });
      var matTexto = new THREE.MeshBasicMaterial({ color: 'red' });
      var texto = new THREE.Mesh(geoTexto, matTexto);
      scene.add(texto);
    });
}

function update(){
  //Cambiar propeidadeas entre frames
  angulo += Math.PI/100;
  esfera.rotation.y = angulo;
  conjunto.rotation.y = angulo/10;
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
