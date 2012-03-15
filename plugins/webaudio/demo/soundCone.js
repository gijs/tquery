var SoundCone	= function(webaudio, soundUrl){
	var group	= tQuery.createObject3D();
	this._group	= group;

	var material	= new THREE.MeshLambertMaterial({
		ambient	: 0x444444,
		color	: 0xFF5588,
		specular: 0xCC88ff,
		shininess: 400
	});

		
	var post	= tQuery.createCube(0.1,1.5,0.1, material).addTo(group)
		.translateY(1.5/2);
	var cone	= tQuery.createCylinder(0, 0.5, 1, 16, 4, material).addTo(group)
		.translateY(1.5).translateZ()
		.rotateX(Math.PI/2);
	this._cone	= cone;

	// setup .castShadow	
	post.get(0).castShadow	= true;
	cone.get(0).castShadow	= true;

	world.loop().hook(function(){
		cone.rotateZ(0.01);
	}.bind(this));

	// create the webaudio sound
	var sound	= new THREEx.WebAudio.Sound(webaudio, soundUrl, function(sound){
		sound._source.loop	= true;
		//sound.volume(0.5);
		sound.play();
	});
	// update sound position with this._group position
	world.loop().hook(function(deltaTime){
		var object3d	= this._group.get(0);
		sound.updateWithObject3d(object3d, deltaTime)
	}.bind(this));

	this._initSoundScale(sound, cone);
};

SoundCone.prototype.object3D	= function(){
	return this._group;
}

SoundCone.prototype._initSoundScale	= function(sound, object){
	var analyser	= sound._analyser;
	var freqByte	= new Uint8Array(analyser.frequencyBinCount);
	analyser.smoothingTimeConstant = 0.6;
	tQuery.world.loop().hook(function(){
		analyser.getByteFrequencyData(freqByte);
		var nb		= 2;
		var total	= 0;
		for(var i = 0; i < nb; i++){
			total	+= freqByte[i];
		}
		var scale	= total / (nb*256-1);
		object.scale(scale*1.5+0.5);
	})
}

