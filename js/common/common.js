var ShimaMeloPlayer = {};
{
  'use strict';

  ShimaMeloPlayer.Common = {};

  ShimaMeloPlayer.Common.initialize = function() {

  };
  
  ShimaMeloPlayer.Common.load = function(fileList, loadComplete) {
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

  ShimaMeloPlayer.Common.run = function(drawFunc) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    drawFunc(context);
    return canvas;
  };
}
