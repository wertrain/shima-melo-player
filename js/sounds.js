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

  // ホワイトノイズを作成する
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

  // 指定されたサウンドを再生を指定された時間で再生する
  // 不足分はバッファを連続してコピーさせる
  ShimaMeloPlayer.Sounds.play = function(audioBuffer, duration) {
    let isExtend = (audioBuffer.duration < duration);
    let frameCount = audioBuffer.sampleRate * (isExtend ? duration : audioBuffer.duration);
    let buffer = _context.createBuffer(audioBuffer.numberOfChannels, frameCount, audioBuffer.sampleRate);

    if (isExtend) {
      for (var channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        let data = audioBuffer.getChannelData(channel);
        let newData = new Float32Array(frameCount);
        let offsetDataLength = data.length / 2.5;

        let index = 0;
        for (let i = 0; i < offsetDataLength; ++i) {
          newData[index++] = data[i];
        }
        let copyIndex = offsetDataLength;
        for (let i = 0; i < frameCount - offsetDataLength; ++i) {
          if (++copyIndex > data.length - offsetDataLength) {
            copyIndex = offsetDataLength;
          }
          newData[index++] = data[copyIndex];
        }
        for (let i = 0; i < offsetDataLength; ++i) {
          newData[index++] = data[(data.length - offsetDataLength) + i];
        }
        buffer.copyToChannel(newData, channel, 0);
        //buffer.copyToChannel(data, channel, 0);
        //buffer.copyToChannel(data, channel, buffer.length - data.length);
      }
    } else {
      for (var channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        buffer.copyToChannel(audioBuffer.getChannelData(channel), channel, 0);
      }
    }

    var source = _context.createBufferSource();
    source.buffer = buffer;
    //source.loop = true;
    source.loopStart = 0;
    source.loopEnd = buffer.duration;
    source.connect(_context.destination);
    source.start();
  }

  ShimaMeloPlayer.Sounds.playAudio = function(audioBuffer) {
    // Create the instance of AudioBufferSourceNode
    var source = _context.createBufferSource();

    // バッファとして複製
    let frameCount = audioBuffer.sampleRate * audioBuffer.duration;
    let buffer = _context.createBuffer(audioBuffer.numberOfChannels, frameCount, audioBuffer.sampleRate);

    // UInt8Array から Float32Array 変換
    // https://stackoverflow.com/questions/34669537/javascript-uint8array-to-float32array
    let convertBlock = function(incomingData) { // incoming data is a UInt8Array
      var i, l = incomingData.length;
      var outputData = new Float32Array(incomingData.length);
      for (i = 0; i < l; i++) {
          outputData[i] = (incomingData[i] - 128) / 128.0;
      }
      return outputData;
    }

    for (var channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      buffer.copyToChannel(audioBuffer.getChannelData(channel), channel, 0);
    }

    // let block = convertBlock(audioBuffer);
    // for (var channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    //   // 実際のデータの配列を得る
    //   var nowBuffering = buffer.getChannelData(channel);
    //   for (var i = 0; i < frameCount; i++) {
    //     nowBuffering[i] = block[i];
    //   }
    // }
    //c.set(audioBuffer, audioBuffer.length);


    //console.log(audioBuffer);
    // Set the instance of AudioBuffer
    source.buffer = buffer;
    //source.buffer = ShimaMeloPlayer.Sounds.createWhiteNoise(1.0);
    // Set parameters
    //source.loop               = true;
    //source.loopStart          = 0.08;
    //source.loopEnd            = 0.083;
    //source.loop               = true;
    source.loopStart          = 0;
    //source.loopEnd            = audioBuffer.duration;
    source.loopEnd            = buffer.duration;
    //source.playbackRate.value = 0.1;
    
    source.connect(_context.destination);
    // Start audio
    source.start();
  };
}


