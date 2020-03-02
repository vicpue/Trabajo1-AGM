init();
loadScene();
setupGUI();
render();

function init() {
     //Motor de render
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth,window.innerHeight);
     renderer.setClearColor(new THREE.Color(0x000000))
     document.getElementById('container').appendChild(renderer.domElement);
     
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

function loadScene(){

    conjunto = new THREE.Object3D();
    conjunto.position.y = 1;

    //Suelo
  var geoSuelo = new THREE.PlaneGeometry(10, 10, 12, 12);
  var matSuelo = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false });
  var suelo = new THREE.Mesh(geoSuelo, matSuelo);
  suelo.rotation.x = -Math.PI / 2;
  suelo.position.y = -0.1;
}