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
    width: 10,
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

var cubo ={
  
  x: 0,
  y: 0,
  mesh: null
}

var juego ={
  estado:"preparado"
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


function initLuces() {
  var light = new THREE.DirectionalLight(0xffffff, 0.7);
  light.position.set(0, 4, 30);

  var spotLight = new THREE.SpotLight(0xffffff,0.7);

  spotLight.position.set(0,4,30);
  spotLight.shadowCameraNear = 10;
  spotLight.shadowCameraFar = 20;
  spotLight.castShadow = true;

  scene.add(spotLight);

  scene.add(light);
}

function init() {
     //Motor de render
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth,window.innerHeight);
     renderer.setClearColor(new THREE.Color(0x000000));
     renderer.shadowMap.enabled=true;
     renderer.shadowMap.type = THREE.BasicShadowMap;
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
     var time = 0;
     window.addEventListener('resize',updateAspectRatio);
     loadScene();


    function mainLoop(timestamp) {
    requestAnimationFrame(mainLoop);
    renderer.render(scene, camera);
    var delta = timestamp - time;
    time = timestamp;
    if (juego.estado === "jugando") {
        ball.mesh.position.x += ball.velocity.x * delta / 8000;
        ball.mesh.position.y += ball.velocity.y * delta / 8000;
        detectarColisiones();
    }
    if (ball) {
	    ball.mesh.position.x = ball.mesh.position.x;
	    ball.mesh.position.y = ball.mesh.position.y;
	}
  }      
        mainLoop();     
}

function loadScene() {

  conjunto = new THREE.Object3D();
  conjunto.position.x= 0;
  conjunto.position.y = 0;

  scene.add(new THREE.AxesHelper(3));
  initLuces();
  tablero();  
  initCubos(); 

  var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
  var paddleGeometry = new THREE.BoxGeometry(paddle.width, paddle.height, 2);
  paddle.mesh = new THREE.Mesh(paddleGeometry, material); 
  paddle.mesh.position.x = 0;
  paddle.mesh.position.y = -SupInf +3;
  paddle.castShadow = true;
  paddle.recevieShadow = true;
  scene.add(paddle.mesh);
  ball.mesh = new THREE.PointLight(0xffffff, 1, 10);
  var ballGeometry = new THREE.SphereGeometry(ball.radius);
  var ballMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
  ball.mesh.add(new THREE.Mesh(ballGeometry, ballMaterial));
  ball.mesh.position.x = paddle.mesh.position.x;
  ball.mesh.position.y = paddle.mesh.position.y+1.5;
  scene.add(ball.mesh);
  

}

function detectarColisiones(){
  
  if(ball.mesh.position.x + ball.radius > Lateral){
    ball.velocity.x= -ball.velocity.x;
    ball.mesh.position.x= Lateral -ball.radius;
    return;
  }

  if(ball.mesh.position.x + ball.radius < -Lateral){
    ball.velocity.x= -ball.velocity.x;
    ball.mesh.position.x= -Lateral +ball.radius;
    return;
  }

  if(ball.mesh.position.y + ball.radius > SupInf){
    ball.velocity.y= -ball.velocity.y;
    ball.mesh.position.y= SupInf -ball.radius;
    return;
  }

  //paddle
  if (ball.mesh.position.y-ball.radius < paddle.mesh.position.y + paddle.height && juego.estado === "jugando") {
      if(ball.mesh.position.x >= paddle.mesh.position.x-paddle.width/2 && ball.mesh.position.x <paddle.mesh.position.x+paddle.width/2){        
        ball.velocity.y = -ball.velocity.y;
        ball.mesh.position.y = paddle.mesh.position.y+paddle.height+ball.radius;
      }else{
        ball.velocity.x = 0;
        ball.velocity.y = 0;
      }
  }
  return;
}

function update(){
  angulo += Math.PI/10;
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

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  // Izquierda
  if (keyCode === 37) {
      if(paddle.mesh.position.x > -Lateral+0.5+paddle.width/2){
      paddle.mesh.position.x = paddle.mesh.position.x -0.7;
        if(juego.estado == "preparado"){
          ball.mesh.position.x = ball.mesh.position.x -0.7;
        }
      }
      else{
        paddle.mesh.position.x = -Lateral+0.5+paddle.width/2;
      }
    } 
  // Derecha
  if (keyCode === 39) {
    if(paddle.mesh.position.x < Lateral-0.5-paddle.width/2){
    paddle.mesh.position.x = paddle.mesh.position.x +0.7;
      if(juego.estado == "preparado"){
        ball.mesh.position.x = ball.mesh.position.x +0.7;
      }
    }
    else{
      paddle.mesh.position.x = Lateral-0.5-paddle.width/2;
    }
  }
  //Espacio
  if (keyCode === 32 && juego.estado === "preparado") {
    ball.velocity.x += 25;
    juego.estado = "jugando";
  }
};

function tablero(){
  //MARCO INFERIOR - SUPERIOR
  var geoMarcoInferior = new THREE.BoxGeometry(36,1,1);
  var matMarcoInferior = new THREE.MeshPhongMaterial({color : colorMarco});

  var marcoInferor = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoInferor.position.y = -SupInf;
  marcoInferor.recevieShadow = true;
  marcoInferor.castShadow = true;

  var marcoSuperior = new THREE.Mesh(geoMarcoInferior,matMarcoInferior);
  marcoSuperior.position.y= SupInf;

  //MARCO LATERAL DERECHO - IZQUIERDO
  
  var geoMarcoLateral = new THREE.BoxGeometry(1,44,1);
  var matMarcoLateral = new THREE.MeshPhongMaterial({color : colorMarco});

  var marcoLateralDerecho = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralDerecho.position.x = Lateral;

  var marcoLateralIzquierdo = new THREE.Mesh(geoMarcoLateral,matMarcoLateral);
  marcoLateralIzquierdo.position.x = -Lateral;

  //FONDO
  var geoMarcoFondo = new THREE.BoxGeometry(36,44,1);
  var matMarcoFondo = new THREE.MeshPhongMaterial({color : colorMarco});

  var fondo = new THREE.Mesh(geoMarcoFondo,matMarcoFondo);
  fondo.position.z = -4 ;
  fondo.recevieShadow = true;
  

  //Grafo
  scene.add(marcoInferor);
  scene.add(marcoSuperior);
  scene.add(marcoLateralDerecho);
  scene.add(marcoLateralIzquierdo);
  scene.add(fondo);
}

function Cubo(x, y){
  var matCubo = new THREE.MeshPhongMaterial({ color: new THREE.Color(randColor(), randColor(), randColor())});
  var geoCubo = new THREE.BoxGeometry(6, 2, 3);
  cubo.mesh = new THREE.Mesh(geoCubo, matCubo);
  cubo.mesh.position.x = x;
  cubo.mesh.position.y = y;
  cubo.recevieShadow = true;
  cubo.mesh.castShadow = true;
  
  
  scene.add(cubo.mesh);
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

