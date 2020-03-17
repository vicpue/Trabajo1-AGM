/*
**Tranajo #1: Breakout Game
**@author: vicaspue@alumno.upv.es
**@date: 02-03-2020
*/


// Variables globales estandar

var renderer=null, 
  scene=null, 
  camera=null;

var paddle = {
    width: 7,
    height: 1,
    speed: 320,
    x: 0,
    y: -SupInf + 3 ,    
    dir: 0,
    mesh: null
};
var ball = {
  x: 0,
  y: 0,
  radius: 1,
  velocity: {x: 0, y: 250},
  mesh: null
};

//Otras Variables
var angulo = 0;
var conjunto;
var colorMarco = 0x755E59;
var xSpeed= 1.0;
var direction= "stop";
var FILAS = 5;
var COLS = 5;
//marco 
var SupInf = 23;
var Lateral = 18.5;

init();

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
     camera.position.set(0, 4, 40);
     camera.lookAt(new THREE.Vector3(0,0,0) );

      //Control de camera
      cameraControls = new THREE.OrbitControls(camera,render.domElement);
      cameraControls.noKeys = true;
      cameraControls.target.set(0,0,0);
      cameraControls.noZoom = false;
      
     //Atender a eventos
     window.addEventListener('resize',updateAspectRatio);
     loadScene();
     initKeys();
     var delta = timestamp - time;
	time = timestamp;
     var paddleDelta = paddle.speed*delta/1000;
    	if ((paddle.dir === -1 && paddle.x > paddleDelta) ||
    	    (paddle.dir === 1 && paddle.x + paddleDelta + paddle.width < width))
    	    paddle.x += paddleDelta * paddle.dir;
}

function loadScene() {

  conjunto = new THREE.Object3D();
  conjunto.position.x= 0;
  conjunto.position.y = 0;

  scene.add(new THREE.AxesHelper(3));
  tablero();  
  initCubos();
  initLuces();

  var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  var paddleGeometry = new THREE.BoxGeometry(paddle.width, paddle.height, 2);
  paddle.mesh = new THREE.Mesh(paddleGeometry, material); 
  paddle.mesh.position.x = 0
  paddle.mesh.position.y = -SupInf +3;
  scene.add(paddle.mesh);
  ball.mesh = new THREE.PointLight(0xffffff, 1, 20);
  var ballGeometry = new THREE.SphereGeometry(ball.radius);
  var ballMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  ball.mesh.add(new THREE.Mesh(ballGeometry, ballMaterial));
  scene.add(ball.mesh);
  //game.state = "ready";
  //resetPaddle();

}

function update(){
  angulo += Math.PI/10;
  initKeys();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  update();
}

function updateAspectRatio(){
    var aspectRatio=window.innerWidth/window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = aspectRatio;  
    camera.updateProjectionMatrix();
   
}

function initKeys(){
  document.addEventListener("keydown", function(e) {
    if (e.keyCode === 39)
        paddle.dir = 1;
    else if (e.keyCode === 37)
        paddle.dir = -1;},false);
  document.addEventListener("keyup", function(e) {
  if ((e.keyCode === 39 && paddle.dir === 1) ||
	    (e.keyCode === 37 && paddle.dir === -1))
    	    paddle.dir = 0;
    }, false);
}

function tablero(){
  //MARCO INFERIOR - SUPERIOR
  var geoMarcoInferior = new THREE.BoxGeometry(36,1,1);
  var matMarcoInferior = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoInferor = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoInferor.position.y = -SupInf;

  var marcoSuperior = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoSuperior.position.y= SupInf;

  //MARCO LATERAL DERECHO - IZQUIERDO
  
  var geoMarcoLateral = new THREE.BoxGeometry(1,44,1);
  var matMarcoLateral = new THREE.MeshBasicMaterial({color : colorMarco});

  var marcoLateralDerecho = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralDerecho.position.x = Lateral;

  var marcoLateralIzquierdo = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralIzquierdo.position.x = -Lateral;

  //FONDO
  var geoMarcoFondo = new THREE.BoxGeometry(36,44,1);
  var matMarcoFondo = new THREE.MeshBasicMaterial({color : colorMarco});

  var fondo = new THREE.Mesh(geoMarcoFondo,matMarcoFondo);
  fondo.position.z = -4 ;
  

  //Grafo
  scene.add(marcoInferor);
  scene.add(marcoSuperior);
  scene.add(marcoLateralDerecho);
  scene.add(marcoLateralIzquierdo);
  scene.add(fondo);
}



function Cubo(x, y){
  var geoCubo = new THREE.BoxGeometry(6, 2, 3);
  var matCubo = new THREE.MeshBasicMaterial({ color: new THREE.Color(randColor(), randColor(), randColor())});
  var cubo = new THREE.Mesh(geoCubo, matCubo);
  cubo.position.x = x;
  cubo.position.y = y;
  
  scene.add(cubo);

}

function randColor() {
  return 0.3 + 0.7*Math.random();
}

function initCubos(){
  var x,y;
  x= -14;
  y= 23;
  for(var i = 0;i<FILAS;i++){
    y=23;
    if(i!=0)
    x=x+7;
    for(var j = 0; j<COLS;j++){
      y = y - 3;
      Cubo(x,y);
    }
  }
}

function initLuces() {
  var light = new THREE.DirectionalLight(0xffffff, 3);
  var ambient = new THREE.AmbientLight(0xffffff, 1);
  light.position.set(0, 4, 30);
  scene.add(light);
  scene.add(ambient);
}