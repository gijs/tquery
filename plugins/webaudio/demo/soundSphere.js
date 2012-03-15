var SoundSphere	= function(webaudio, soundUrl){	
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
	var sphere	= tQuery.createSphere(0.5, 32, 16, material).addTo(group)
		.translateY(1.5);


	// setup .castShadow	
	post.get(0).castShadow	= true;
	sphere.get(0).castShadow= true;
	
	
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

	this._initSoundScale(sound, sphere);
};

SoundSphere.prototype.object3D	= function(){
	return this._group;
}

SoundSphere.prototype._initSoundScale	= function(sound, object){
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

