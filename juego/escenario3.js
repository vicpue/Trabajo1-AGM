 var blocks = [],
    width = 200,
    height = 100,
    ROWS = 16,
    COLS = 5,
    blockWidth = 80,
    blockHeight = 10,
    renderer = null,
    scene = null,
    camera = null,
    SupInf = 23,
    Lateral = 18,
    colorMarco = 0x0C7C7C;

var paddle = {
    width: 80,
    height: 10,
    speed: 320,
    x: 0,
    y: 0,    
    dir: 0,
    mesh: null
};

var bola = {
    x: 0,
    y: 0,
    radio: 7,
    velocidad: {x: 0, y: 250},
    mesh: null
};

var partida = {
    estado: "ready",
    bloques: ROWS*COLS,   
    puntos: 0,
    vidas: 3
};

start();

function iniciarTablero() {
    var sidegeometry = new THREE.BoxGeometry(10, 400, 50);
    var sidematerial = new THREE.MeshPhongMaterial(
	{color: 0x2222aa,
	 specular: 0x333333,
	 shininess: 5}
    );
    var leftbox = new THREE.Mesh(sidegeometry, sidematerial);
    var topGeometry = new THREE.BoxGeometry(400, 10, 50);
    var rightbox = new THREE.Mesh(sidegeometry, sidematerial);
    var botbox = new THREE.Mesh(topGeometry, sidematerial);
    var topbox = new THREE.Mesh(topGeometry, sidematerial);
    leftbox.position.set(-200, 0, 0);
    rightbox.position.set(width, 0, 0);
    botbox.position.set(0, -200, 0);
    topbox.position.set(0, 200, 0);
    scene.add(botbox);
    scene.add(leftbox);
    scene.add(rightbox);
    scene.add(topbox);
    scene.add(new THREE.AxesHelper(500));
}

function initLights() {
    var light = new THREE.DirectionalLight(0xffffff, 0.7);
    var ambient = new THREE.AmbientLight(0xffffff, 0.2);
    light.position.set(50, 10, 100);
    scene.add(light);
    scene.add(ambient);
}

function initStatusText() {
    var status = document.createElement("div");
    status.id = "status";
    status.style.position = "absolute";
    status.style.top = "0px";
    status.style.padding = "10px";
    status.style.width = "200px";
    status.style.height = "100px";
    status.style.fontFamily = "monospace";
    status.innerHTML = "Score: " + partida.puntos + " Lives: " + partida.vidas;
    status.style.color = "white";
    document.body.appendChild(status);
}

function drawText(msg) {
    var text = document.createElement("div");
    text.id = "message";
    text.style.position = "absolute";
    text.style.top = window.innerHeight/2 + "px";
    text.style.fontSize = 48;
    text.style.left = window.innerWidth/3 + "px";
    text.innerHTML = msg;
    text.style.color = "white";
    text.style.fontFamily = "arial";
    document.body.appendChild(text);
}




function render() {
    // Bucle de refresco
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
    }


function start() {
    scene = new THREE.Scene();
    var aspectRatio = window.innerWidth/window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0,0,400);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.aspect = aspectRatio;
    
    cameraControls = new THREE.OrbitControls(camera,render.domElement);
    cameraControls.target.set(0,0,0);
    cameraControls.noZoom = false;
    initLights();
    iniciarTablero();
    initStatusText();
    initGame();
    initKeys();
    var time = 0;
    window.addEventListener('resize',updateAspectRatio);
   

    function mainLoop(timestamp) {
	requestAnimationFrame(mainLoop);
	renderer.render(scene, camera);
	var delta = timestamp - time;
	time = timestamp;
	var paddleDelta = paddle.speed*delta/1000;
    	if ((paddle.dir === -1 && paddle.x > paddleDelta) ||
    	    (paddle.dir === 1 && paddle.x + paddleDelta + paddle.width < width))
    	    paddle.x += paddleDelta * paddle.dir;
	if (partida.estado === "running") {
	    bola.x += bola.velocidad.x * delta / 1000;
    	    bola.y += bola.velocidad.y * delta / 1000;
    	    detectCollisions();
	} else  {
    	    bola.x = paddle.x+paddle.width/2;
    	    bola.y = paddle.y+paddle.height+bola.radio;
    	} 
	if (bola) {
	    bola.mesh.position.x = bola.x;
	    bola.mesh.position.y = bola.y;
	}
	if (paddle) {
	    paddle.mesh.position.x = paddle.x+paddle.width/2
	    paddle.mesh.position.y = paddle.y+paddle.height/2;
	}
    }
    mainLoop();
}

function updateStatus() {
    var s = document.getElementById("status");
    if (partida.vidas === 0) {
	drawText("GAME OVER");
	resetGame();
	partida.estado = "over";
    } else if (partida.bloques === 0) {
	drawText("YOU WIN");
	resetGame();
	partida.estado = "over";
    } 
    s.innerHTML = 'Score: ' + partida.puntos + ' Lives: ' + partida.vidas;
}

function resetGame() {
    partida.vidas = 3
    partida.puntos = 0
    partida.bloques = ROWS*COLS;
    scene.remove(paddle.mesh);
    scene.remove(bola.mesh);
    for (var i = 0; i < ROWS; i++)
	for (var j = 0; j < COLS; j++)
	    scene.remove(blocks[i][j].object);
    initGame();
}

function detectCollisions() {
    // walls
    if (bola.x+bola.radio > width) {
	bola.velocidad.x = -bola.velocidad.x;
	bola.x = width-bola.radio;
	return;
    }
    if (bola.x-bola.radio < 0) {
	bola.velocidad.x = -bola.velocidad.x;
	bola.x = bola.radio;
	return;
    }
    if (bola.y+bola.radio > height) {
	bola.velocidad.y = -bola.velocidad.y;
	bola.y = height-bola.radio;
	return;
    }
    
    // paddle
    if (bola.y-bola.radio < paddle.y+paddle.height
	&& partida.estado === "running") {
	if (bola.x >= paddle.x && bola.x < paddle.x+paddle.width) {
	    bola.velocidad.x += paddle.dir*50;
	    bola.velocidad.y = -bola.velocidad.y;
	    bola.y = paddle.y+paddle.height+bola.radio;
	} else {
	    partida.vidas--;
	    partida.puntos = 0;
	    resetPaddle();
	    partida.estado = "ready";
	    updateStatus();
	}
	return;
    }
    
    // blocks
    if (bola.y+bola.radio < height-ROWS*blockHeight)
	return;
    var col = Math.floor((bola.x-bola.radio)/blockWidth);
    var row = Math.floor((height-bola.y-bola.radio)/blockHeight);
    if (row < 0 || col < 0 || blocks[row][col].status === 1)
	return;
    var x = col*blockWidth;
    var y = height-row*blockHeight;
    if (bola.x+bola.radio >= x && bola.x-bola.radio < x+blockWidth
	&& bola.y+bola.radio > y-blockHeight && bola.y-bola.radio < y) {
	bola.velocidad.y = -bola.velocidad.y;
	blocks[row][col].status = 1;
	scene.remove(blocks[row][col].object);
	partida.puntos++;
	partida.bloques--;
	updateStatus();
    }
}

function initKeys() {
    document.addEventListener("keydown", function(e) {
	if (e.keyCode === 39)
	    paddle.dir = 1;
	else if (e.keyCode === 37)
	    paddle.dir = -1;
	else if (e.keyCode === 32 && partida.estado === "ready") {
	    bola.velocidad.x += paddle.dir * 25;
	    if (bola.velocidad.x > width)
		bola.velocidad.x = width;
	    partida.estado = "running";
	}
	if (partida.estado === "over") {
	    var elem = document.getElementById("message");
	    elem.parentNode.removeChild(elem);
	    partida.estado = "ready";
	}
    }, false);
    document.addEventListener("keyup", function(e) {
	if ((e.keyCode === 39 && paddle.dir === 1) ||
	    (e.keyCode === 37 && paddle.dir === -1))
    	    paddle.dir = 0;
    }, false);
}

function resetPaddle() {
    paddle.x = width/2-paddle.width/2;
    paddle.y = 0;
    paddle.mesh.position.x = paddle.x+paddle.width/2;
    paddle.mesh.position.y = paddle.height/2;
    paddle.dir = 0;
    bola.x = paddle.x+paddle.width/2;
    bola.y = paddle.y+paddle.height+bola.radio;
    bola.mesh.position.x = bola.x;
    bola.mesh.position.y = bola.y;
    bola.velocidad.x = Math.random()*200-100;
    bola.velocidad.y = 250;
}

function initGame() {
    var geometry = new THREE.BoxGeometry(blockWidth, blockHeight, 100);
    for (var i = 0; i < ROWS; i++) {
	blocks[i] = [];
	for (var j = 0; j < COLS; j++) {
	    var material = new THREE.MeshPhongMaterial(
		{color: new THREE.Color(randColor(),
					randColor(),
					randColor())
		});
	    var object = new THREE.Mesh(geometry, material);
	    blocks[i][j] = { status: 0,
			     object: object
			   };
	    object.position.set(j*blockWidth+blockWidth/2,
				height-(i*blockHeight+blockHeight/2), 0);
	    scene.add(object);
	}
    }
    var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    var paddleGeometry = new THREE.BoxGeometry(paddle.width-200, paddle.height, 50);
    paddle.mesh = new THREE.Mesh(paddleGeometry, material);
    scene.add(paddle.mesh);
    bola.mesh = new THREE.PointLight(0xffffff, 1, 200);
    var ballGeometry = new THREE.SphereGeometry(bola.radio);
    var ballMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    bola.mesh.add(new THREE.Mesh(ballGeometry, ballMaterial));
    scene.add(bola.mesh);
    partida.estado = "ready";
    resetPaddle();
}

function randColor() {
    return 0.3 + 0.7*Math.random();
}

function updateAspectRatio(){
    //Mantener la relacion de aspecto entre marco y camara
      var aspectRatio=window.innerWidth/window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
     
       }