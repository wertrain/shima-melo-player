var ShimaMeloPlayer = {};
{
  'use strict';

  ShimaMeloPlayer.Common = {};

  ShimaMeloPlayer.Common.initialize = function() {

  };
  
  ShimaMeloPlayer.Common.loadImages = function(fileList, loadComplete) {
    let imageList = []
    let loadedCount = 0;
    for (let i in fileList) {
      imageList[i] = new Image();
      imageList[i].src = fileList[i];
      imageList[i].addEventListener("load", function() {
        if (++loadedCount >= imageList.length) {
          loadComplete();
        }
      });
    }
    return imageList;
  };

  ShimaMeloPlayer.Common.loadAudios = function(fileList, loadComplete) {
    let audioList = []
    let loadedCount = 0;
    for (let i in fileList) {
      audioList[i] = new Audio();
      audioList[i].src = fileList[i];
      audioList[i].addEventListener("canplaythrough", function() {
        if (++loadedCount >= audioList.length) {
          loadComplete();
        }
      });
    }
    return audioList;
  };

  ShimaMeloPlayer.Common.run = function(drawFunc) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    drawFunc(context);
    return canvas;
  };

  ShimaMeloPlayer.Common.convertDataURIToBinary = function(dataURI) {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
}
