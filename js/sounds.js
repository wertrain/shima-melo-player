{
  'use strict';

  let _context = null;
  let _gain = null;
  let _buffer = null;

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

  ShimaMeloPlayer.Sounds.createWhiteNoise = function(seconds) {
    // ステレオ
    const channels = 2;
    // 作成するホワイトノイズの時間
    // 未設定の場合は 10 秒
    const s = typeof (seconds) === 'undefined' ? 10.0 : seconds;
    // AudioContextのサンプルレートで s 秒間の空のステレオバッファを生成する
    const frameCount = _context.sampleRate * s;
    // バッファを作成
    let buffer = _context.createBuffer(2, frameCount, _context.sampleRate);
    // バッファにホワイトノイズを書き込む;
    // 単なる-1.0から1.0の間の乱数の値である
    for (var channel = 0; channel < channels; channel++) {
      // 実際のデータの配列を得る
      var nowBuffering = buffer.getChannelData(channel);
      for (var i = 0; i < frameCount; i++) {
        // Math.random()は[0; 1.0]である
        // 音声は[-1.0; 1.0]である必要がある
        nowBuffering[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  ShimaMeloPlayer.Sounds.playAudio = function(audioBuffer) {
    // Create the instance of AudioBufferSourceNode
    var source = _context.createBufferSource();

    var c = new Uint8Array(audioBuffer.length + audioBuffer.length);
    c.set(audioBuffer);
    //c.set(audioBuffer, audioBuffer.length);

    console.log(c);
    // Set the instance of AudioBuffer
    //source.buffer = audioBuffer;
    source.buffer = ShimaMeloPlayer.Sounds.createWhiteNoise(1.0);
    // Set parameters
    //source.loop               = true;
    //source.loopStart          = 0.08;
    //source.loopEnd            = 0.083;
    source.loop               = false;
    source.loopStart          = 0;
    source.loopEnd            = audioBuffer.duration;
    //source.playbackRate.value = 0.1;
    
    source.connect(_context.destination);
    // Start audio
    source.start();
  };
}


