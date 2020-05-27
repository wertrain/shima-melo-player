{
  'use strict';

  let _context = null;
  let _gain = null;

  ShimaMeloPlayer.Sounds = {};

  ShimaMeloPlayer.Sounds.initialize = function() {
    try {
      // Create the instance of AudioContext
      _context = new AudioContext();
       // Create the instance of GainNode
       _gain = _context.createGain();
    } catch (error) {
      window.alert(error.message + 'Your browser is not supported "AudioContext".');
      return null;
    }
    return _context;
  };
  
  ShimaMeloPlayer.Sounds.playAudio = function(audioBuffer) {
    // Create the instance of AudioBufferSourceNode
    var source = _context.createBufferSource();
    // Set the instance of AudioBuffer
    source.buffer = audioBuffer;
    // Set parameters
    //source.loop               = true;
    //source.loopStart          = 0.10;
    //source.loopEnd            = 0.11;
    //source.loop               = false;
    //source.loopStart          = 0;
    //source.loopEnd            = audioBuffer.duration;
    //source.playbackRate.value = 0.1;
    
    source.connect(_context.destination);
    // Start audio
    source.start();
  };
}


