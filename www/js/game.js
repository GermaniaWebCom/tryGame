var app = {
  inicio: function() {
	  
	//window.screen.orientation.lock('portrait'); No me ha funcionado correctamente
	
    TAMANO_LOBO = 80;
	
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
	contador = 0;
	level = 0;
	intervalo = 5;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.vigilaSensores();
    app.iniciaJuego();
	setInterval(app.tiempo, 1000);	
	alert('¿Comenzamos a jugar?');
	
  },  
  	
  
  iniciaJuego: function() {
	 
    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      
	  //game.stage.background = fondo;
	  this.load.image ('tile', 'img/assets/tile.png');
      game.load.image('lobo', 'img/assets/lobo.png');
	  
      game.load.image('pollo', 'img/assets/pollo.png');
	  game.load.image('vaca', 'img/assets/vaca.png');
	  game.load.image('cerdo', 'img/assets/cerdo.png');
    }

    function create() {
    
	this.add.image(0, 0, 'tile');
	
	lobo = game.add.sprite(app.inicioX(), app.inicioY(), 'lobo');
	game.physics.arcade.enable(lobo);
	
	pollo =  game.add.sprite(app.inicioX(), app.inicioY(), 'pollo');
	game.physics.arcade.enable(pollo);
	
	
	vaca =  game.add.sprite(app.inicioX(), app.inicioY(), 'vaca');
	game.physics.arcade.enable(vaca);
	
	cerdo =  game.add.sprite(app.inicioX(), app.inicioY(), 'cerdo');
	game.physics.arcade.enable(cerdo);    
     
	lobo.body.collideWorldBounds = true;
    //  lobo.body.onWorldBounds = new Phaser.Signal();
    //  lobo.body.onWorldBounds.add(app.decrementaPuntuacion, this);
	
	scoreText = game.add.text(5, 5, contador, { fontSize: '50px', fill: '#ff0000' });
    }
	
    function update() {
	
      var dificultadNivel = (300 - (dificultad * 55));
	 
      lobo.body.velocity.y = (velocidadY * dificultadNivel);
      lobo.body.velocity.x = (velocidadX * (-1 * dificultadNivel));

      game.physics.arcade.overlap(lobo, pollo, app.quitaPollo, null, this);
	  
	  game.physics.arcade.overlap(lobo, vaca, app.quitaVaca, null, this);
	  
	  game.physics.arcade.overlap(lobo, cerdo, app.quitaCerdo, null, this);
	  
	}
	
	
    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'world', estados);
	
  },  

 nuevoNivel: function(){
	 
	 if(level == 6){
		 alert('¡Has ganado el juego! \n Presiona Aceptar para jugar de nuevo')	;
			app.recomienza();
		}
		else{	
			intervalo = 5;
			alert('Has pasado al Nivel' + level);
						  
			pollo.body.x = app.inicioX();
			pollo.body.y = app.inicioY();
			
			vaca.body.x = app.inicioX();
			vaca.body.y = app.inicioY();
			
			cerdo.body.x = app.inicioX();
			cerdo.body.y = app.inicioY();
			
			}
	},
  
  quitaPollo: function(){
	pollo.body.x = ancho + 100;
    pollo.body.y = alto + 100;

	contador = contador + 1;
	scoreText.text = contador;
	if(contador == 3){
		contador = 0;
		level = level + 1;
		dificultad = dificultad + 1;		
		app.nuevoNivel();
	}	
  },
  
  quitaVaca: function(){
	vaca.body.x = ancho + 100; 
    vaca.body.y = alto + 100;	
	
	contador = contador + 1;
	scoreText.text = contador;
	if(contador == 3){
		contador = 0;
		level = level + 1;
		dificultad = dificultad + 1;
		app.nuevoNivel();
	}
	
  },
  
  quitaCerdo: function(){
	cerdo.body.x = ancho + 100; 
    cerdo.body.y = alto + 100;
   
	contador = contador + 1;
	scoreText.text = contador;
	if(contador == 3){
		contador = 0;
		level = level + 1;
		dificultad = dificultad + 1;
		app.nuevoNivel();
	}
	
  },

  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - TAMANO_LOBO);
  },

  inicioY: function() {
    return app.numeroAleatorioHasta(alto - TAMANO_LOBO);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function() {
    function onError() {
      console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, {
      frequency: 10
    });
  },
//Esta es una de las funciones que se modificó para darle más jugabilidad al juego.
  detectaAgitacion: function(datosAceleracion) {
    agitacionX = datosAceleracion.x > 10;
    agitacionY = datosAceleracion.y > 10;
    if (agitacionX || agitacionY) {	
      setTimeout(app.recomienza, 1000);
    }
  },

  //Esta es la función que recomienza el juego.
  recomienza: function() {
	 
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion) {
    velocidadX = datosAceleracion.x;
    velocidadY = datosAceleracion.y;
  },
  
  tiempo: function(){
	
	  if(intervalo <= 0){
		  app.perdiste();
	  }
	  
	   intervalo = intervalo - 1;	
	  
  }, 
  
  perdiste: function(){
	  
	  mensaje = 'Perdiste';
	  scoreText.text = mensaje;
	  setTimeout(app.recomienza, 1000);
	
  }
	
};

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}
