/*
Copyright (c) 2012 Linus Suter
Examples and docs at: http://codewelt.com/blendmode
Licensed GPL licenses:
http://www.gnu.org/licenses/gpl.html
*/
(function($) {
	$.fn.blendmode = function(options) {
	  	var settings = $.extend( {
			mode : "multiply",
			object : null,
			scale : false
		}, options);
		
		var blend = function(object) {
			var $this = object;
			if ($this == null) return;
			var sourceCanvas = document.getElementsByName('blendModePlugin_sourceCanvas_' + $this.id)[0];
			if (sourceCanvas == null) {
				sourceCanvas = document.createElement('canvas');
				sourceCanvas.name = 'blendModePlugin_sourceCanvas_' + $this.id;
			}
			var sourceCanvasContext = sourceCanvas.getContext("2d");
			
			if ($this.nodeName == "IMG") {
				sourceCanvas.width = $this.width;
				sourceCanvas.height = $this.height;
				sourceCanvasContext.drawImage($this, 0, 0);
			} else if ($this.nodeName == "CANVAS") {
				sourceCanvas = $this;
				sourceCanvasContext = $this.getContext("2d"); 
			} else return;
			sourcePixels = sourceCanvasContext.getImageData(0, 0, $this.width, $this.height);
			var param;
			var targetCanvas = document.getElementsByName('blendModePlugin_targetCanvas_' + $this.id)[0];
			if (targetCanvas == null) {
				targetCanvas = document.createElement('canvas');
				targetCanvas.name = 'blendModePlugin_targetCanvas_' + $this.id;
			}
			var targetCanvasContext = targetCanvas.getContext("2d");
			if (typeof options.object == "string") {
				var ext = options.object.substring(options.object.lastIndexOf(".") + 1).toLowerCase();
				if (ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "bmp" || ext == "png") {
					var targetImageAdd = document.getElementsByName('blendModePlugin_targetImageAdd_' + $this.id)[0];
					if (targetImageAdd == null) {
						targetImageAdd = document.createElement("img");
						targetImageAdd.name = 'blendModePlugin_targetImageAdd_' + $this.id;
					}
					targetImageAdd.src = options.object;
					targetCanvas.width = $this.width;
					targetCanvas.height = $this.height;
					targetCanvasContext.drawImage(targetImageAdd, 0, 0);
				} else {
					targetCanvas.width = $(this).width();
					targetCanvas.height = $(this).height();
					$(targetCanvas).css("background-color", options.object);
					targetCanvasContext.fillStyle = $(targetCanvas).css("background-color");
					targetCanvasContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
				}
				param = targetCanvas;
				targetCanvasContext.drawImage(param, 0, 0, $this.width, $this.height);
				targetPixels = targetCanvasContext.getImageData(0, 0, $this.width, $this.height);
			} else {
				if (!options.object) return;
				var targetPixels;
				param = options.object.get(0);
				if (param.nodeName == "DIV") {
					targetCanvas.width = $(this).width();
					targetCanvas.height = $(this).height();
					targetCanvasContext.fillStyle = $(this).css("background-color");
					targetCanvasContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
				} else if (param.nodeName == "IMG") {
					targetCanvas.width = $this.width;
					targetCanvas.height = $this.height;		
				} else if (param.nodeName == "CANVAS") {
					var stringData = param.toDataURL("image/png");
					var targetImage = document.getElementsByName('blendModePlugin_targetImage_' + $this.id)[0];
					if (targetImage == null) {
						targetImage = document.createElement("img");
						targetImage.name = 'blendModePlugin_targetImage_' + $this.id;
					}
					targetImage.src = stringData;
					targetCanvas.width= $this.width;
					targetCanvas.height= $this.height;
					param = targetImage;
				} else return;
				if (!options.scaletofit) targetCanvasContext.drawImage(param, 0, 0);
				else  targetCanvasContext.drawImage(param, 0, 0, $this.width, $this.height);
				targetPixels = targetCanvasContext.getImageData(0, 0, $this.width, $this.height);
			}

			switch (options.mode) {
				case "normal" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							sourcePixels.data[i] = targetPixels.data[i]; 
							sourcePixels.data[i + 1] = targetPixels.data[i+ 1]; 
							sourcePixels.data[i + 2] = targetPixels.data[i+ 2];   
						}
					}
					break;

				case "multiply" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							sourcePixels.data[i] = targetPixels.data[i] * sourcePixels.data[i] / 255;
							sourcePixels.data[i + 1] = targetPixels.data[i + 1] * sourcePixels.data[i + 1] / 255;
							sourcePixels.data[i + 2] = targetPixels.data[i + 2] * sourcePixels.data[i + 2] / 255;
						}
					}
					break;

				case "lighten" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if (red > sourcePixels.data[i]) sourcePixels.data[i] = red;
							if (green > sourcePixels.data[i + 1])	sourcePixels.data[i + 1] = green;
							if (blue > sourcePixels.data[i + 2]) sourcePixels.data[i + 2] = blue;
						}
					}
					break;
					
				case "darken" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if (red < sourcePixels.data[i]) sourcePixels.data[i] = red;
							if (green < sourcePixels.data[i + 1]) sourcePixels.data[i + 1] = green;
							if (blue < sourcePixels.data[i + 2]) sourcePixels.data[i + 2] = blue;
						}
					}
					break;

				case "darkercolor" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if ((red * 0.3+ green * 0.59 + blue * 0.11) <= (sourcePixels.data[i] * 0.3 + sourcePixels.data[i + 1] * 0.59 + sourcePixels.data[i + 2] * 0.11)) {
								sourcePixels.data[i] = red;
								sourcePixels.data[i + 1] = green;
								sourcePixels.data[i + 2] = blue;
							}
						}
					}
					break;

				case "lightercolor" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if ((red * 0.3 + green * 0.59 + blue * 0.11) > (sourcePixels.data[i] * 0.3 + sourcePixels.data[i + 1] * 0.59 + sourcePixels.data[i + 2] * 0.11)) {
								sourcePixels.data[i] = red;
								sourcePixels.data[i + 1] = green;
								sourcePixels.data[i + 2] = blue;
							}
						}
					}
					break;

				case "lineardodge" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = targetPixels.data[i] + sourcePixels.data[i];
							var greenSrc = targetPixels.data[i + 1] + sourcePixels.data[i + 1];
							var blueSrc = targetPixels.data[i+2] + sourcePixels.data[i + 2];
							if (redSrc > 255) sourcePixels.data[i] = 255;
							else	sourcePixels.data[i] = redSrc;
							if (greenSrc > 255) sourcePixels.data[i + 1] = 255;
							else	sourcePixels.data[i + 1] = greenSrc;
							if (blueSrc > 255) sourcePixels.data[i + 2] = 255;
							else	sourcePixels.data[i + 2] = blueSrc;
						}
					}

					break;

				case "linearburn" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = targetPixels.data[i] + sourcePixels.data[i];
							var greenSrc = targetPixels.data[i + 1] + sourcePixels.data[i + 1];
							var blueSrc = targetPixels.data[i + 2] + sourcePixels.data[i + 2];
							if (redSrc < 255) sourcePixels.data[i] = 0;
							else	sourcePixels.data[i] = (redSrc - 255);
							if (greenSrc < 255) sourcePixels.data[i + 1] = 0;
							else	sourcePixels.data[i + 1] = (greenSrc - 255);
							if (blueSrc < 255) sourcePixels.data[i + 2] = 0;
							else	sourcePixels.data[i + 2] = (blueSrc - 255);
						}
					}
					break;

				case "difference" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = targetPixels.data[i] - sourcePixels.data[i];
							var greenSrc = targetPixels.data[i + 1] - sourcePixels.data[i + 1];
							var blueSrc = targetPixels.data[i + 2] - sourcePixels.data[i + 2];
							if (redSrc < 0) sourcePixels.data[i] = -redSrc;
							else	sourcePixels.data[i] = redSrc;
							if (greenSrc < 0) sourcePixels.data[i + 1] = -greenSrc;
							else	sourcePixels.data[i + 1] = greenSrc;
							if (blueSrc < 0) sourcePixels.data[i + 2] = -blueSrc;
							else	sourcePixels.data[i + 2] = blueSrc;
						}
					}
					break;

				case "screen" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							sourcePixels.data[i] = (255 - ( ((255-sourcePixels.data[i]) * (255-targetPixels.data[i])) >> 8));
							sourcePixels.data[i + 1] = (255 - ( ((255-sourcePixels.data[i + 1]) * (255-targetPixels.data[i + 1])) >> 8));
							sourcePixels.data[i + 2] = (255 - ( ((255-sourcePixels.data[i + 2]) * (255-targetPixels.data[i + 2])) >> 8));
						}
					}
					break;

				case "exclusion" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							sourcePixels.data[i] = red - (red * 2 / 255 - 1) * sourcePixels.data[i];
							sourcePixels.data[i + 1] = (green = targetPixels.data[i + 1]) - (green * 2 / 255 - 1) * sourcePixels.data[i + 1];
							sourcePixels.data[i + 2] = (blue = targetPixels.data[i + 2]) - (blue * 2 / 255 - 1) * sourcePixels.data[i + 2];
						}
					}
					break;

				case "overlay" : 
					
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if (red < 128) sourcePixels.data[i] = sourcePixels.data[i] * red * 2 / 255;
							else sourcePixels.data[i] = 255 - (255 - sourcePixels.data[i]) * (255 - red) * 2 / 255;
							if (green < 128) sourcePixels.data[i + 1] = sourcePixels.data[i + 1] * green * 2 / 255;
							else	sourcePixels.data[i + 1] = 255 - (255 - sourcePixels.data[i + 1]) * (255 - green) * 2 / 255;
							if (blue < 128)	sourcePixels.data[i + 2] = sourcePixels.data[i + 2] * blue * 2 / 255;
							else	sourcePixels.data[i + 2] = 255 - (255 - sourcePixels.data[i + 2]) * (255 - blue) * 2 / 255;
						}
					}
					
					break;

				case "softlight" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							if (red < 128) sourcePixels.data[i] = ((sourcePixels.data[i] >> 1) + 64) * red * 2 / 255;
							else	sourcePixels.data[i] = 255 - (191 - (sourcePixels.data[i] >> 1)) * (255 - red) * 2 / 255;
							if (green < 128) sourcePixels.data[i + 1] = ((sourcePixels.data[i + 1] >> 1) + 64) * green * 2 / 255;
							else sourcePixels.data[i + 1] = 255 - (191 - (sourcePixels.data[i + 1] >> 1)) * (255 - green) * 2 / 255;
							if (blue < 128)	sourcePixels.data[i + 2] = ((sourcePixels.data[i + 2] >> 1) + 64) * blue * 2 / 255;
							else	sourcePixels.data[i + 2] = 255 - (191 - (sourcePixels.data[i + 2] >> 1)) * (255 - blue) * 2 / 255;
						}
					}
					break;

				case "hardlight" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = sourcePixels.data[i];
							var green = sourcePixels.data[i + 1];
							var blue = sourcePixels.data[i + 2];
							if (red < 128) sourcePixels.data[i] = targetPixels.data[i] * red * 2 / 255;
							else	sourcePixels.data[i] = 255 - (255-targetPixels.data[i]) * (255 - red) * 2 / 255;
							if (green < 128) sourcePixels.data[i + 1] = targetPixels.data[i + 1] * green * 2 / 255;
							else	sourcePixels.data[i + 1] = 255 - (255-targetPixels.data[i + 1]) * (255 - green) * 2 / 255;
							if (blue < 128) sourcePixels.data[i + 2] = targetPixels.data[i + 2] * blue * 2 / 255;
							else	sourcePixels.data[i + 2] = 255 - (255-targetPixels.data[i + 2]) * (255 - blue) * 2 / 255;
						}
					}	
					break;

				case "colordodge" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = (targetPixels.data[i] << 8) / (255 - (red = sourcePixels.data[i]));
							var greenSrc = (targetPixels.data[i + 1] << 8) / (255 - (green = sourcePixels.data[i + 1]));
							var blueSrc = (targetPixels.data[i + 2] << 8) / (255 - (blue = sourcePixels.data[i + 2]));
							if (redSrc > 255 || r2 == 255)	sourcePixels.data[i] = 255;
							else sourcePixels.data[i] = redSrc;
							if (greenSrc > 255 || g2 == 255) sourcePixels.data[i + 1] = 255;
							else	sourcePixels.data[i + 1] = greenSrc;
							if (blueSrc > 255 || b2 == 255) sourcePixels.data[i + 2] = 255;
							else	sourcePixels.data[i + 2] = blueSrc;
						}
					}
					break;

				case "colorburn" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = 255 - ((255 - targetPixels.data[i]) << 8) / sourcePixels.data[i];
							var greenSrc = 255 - ((255 - targetPixels.data[i + 1]) << 8) / sourcePixels.data[i + 1];
							var blueSrc = 255 - ((255 - targetPixels.data[i + 2]) << 8) / sourcePixels.data[i + 2];
							if (redSrc < 0 || sourcePixels.data[i] == 0) sourcePixels.data[i] = 0;
							else	sourcePixels.data[i] = redSrc;
							if (greenSrc < 0 || sourcePixels.data[i + 1] == 0) sourcePixels.data[i + 1] = 0;
							else	sourcePixels.data[i + 1] = greenSrc;
							if (blueSrc < 0 || sourcePixels.data[i + 2] == 0) sourcePixels.data[i + 2] = 0;
							else	sourcePixels.data[i + 2] = blueSrc;
						}
					}
					break;

				case "linearlight" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = 2 * (red + targetPixels.data[i] - 256) < 0;
							var greenSrc = 2 * (green + targetPixels.data[i + 1] - 256) < 0;
							var blueSrc = 2 * (blue + targetPixels.data[i + 2] - 256) < 0
							if (redSrc || (red < 128 && redSrc < 0)) {
								sourcePixels.data[i] = 0
							} else {
								if (redSrc > 255) sourcePixels.data[i] = 255;
								else	sourcePixels.data[i] = redSrc;
							}
							if (greenSrc || (green < 128 && greenSrc < 0)) {
								sourcePixels.data[i + 1] = 0
							} else {
								if (greenSrc > 255) sourcePixels.data[i + 1] = 255;
								else	sourcePixels.data[i + 1] = greenSrc;
							}
							if (blueSrc || (blue < 128 && blueSrc < 0)) {
								sourcePixels.data[i + 2] = 0
							} else {
								if (blueSrc > 255) sourcePixels.data[i + 2] = 255;
								else	sourcePixels.data[i + 2] =  blueSrc;
							}
						}
					}
					break;
					
				case "vividlight" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = sourcePixels.data[i];
							var green = sourcePixels.data[i + 1];
							var blue = sourcePixels.data[i + 2];
							var redTarget = 255 - ((255 - targetPixels.data[i]) << 8) / (2 * red);
							var redF = 2 * red - 256;
							var greenTarget = 255 - ((255 - targetPixels.data[i + 1]) << 8) / (2 * green);
							var greenF = 2 * red - 256;
							var blueTarget = 255 - ((255 - targetPixels.data[i + 2]) << 8) / (2 * blue);
							var blueF = 2 * red - 256;
							if (red < 128) {
								if (red) {
									if (redTarget < 0) sourcePixels.data[i] = 0;
									else	sourcePixels.data[i] = redTarget;
								} else {
									sourcePixels.data[i] = 0;
								}
							} else if ((redTarget = redF) < 255) {
								if ((redTarget = (targetPixels.data[i] << 8) / (255 - redF)) > 255) sourcePixels.data[i] = 255;
								else	sourcePixels.data[i] = redTarget;
							} else {
								if (redTarget < 0) sourcePixels.data[i] = 0;
								else sourcePixels.data[i] = redTarget;
							}
							if (green < 128) {
								if (green) {
									if (greenTarget < 0) sourcePixels.data[i + 1] = 0;
									else	sourcePixels.data[i + 1] = greenTarget;
								} else {
									sourcePixels.data[i + 1] = 0;
								}
							} else if ((greenTarget = greenF) < 255) {
								if ((greenTarget = (targetPixels.data[i + 1] << 8) / (255 - greenF)) > 255) sourcePixels.data[i + 1] = 255;
								else	sourcePixels.data[i + 1] = greenTarget;
							} else {
								if (greenTarget < 0) sourcePixels.data[i + 1] = 0;
								else sourcePixels.data[i + 1] = greenTarget;
							}
							if (blue < 128) {
								if (blue) {
									if (blueTarget < 0) sourcePixels.data[i + 2] = 0;
									else	sourcePixels.data[i + 2] = blueTarget;
								} else {
									sourcePixels.data[i + 2] = 0;
								}
							} else if ((blueTarget = redF) < 255) {
								if ((blueTarget = (targetPixels.data[i + 2] << 8) / (255 - blueF)) > 255) sourcePixels.data[i + 2] = 255;
								else	sourcePixels.data[i + 2] = blueTarget;
							} else {
								if (blueTarget < 0) sourcePixels.data[i + 2] = 0;
								else sourcePixels.data[i + 2] = blueTarget;
							}
						}
					}		
					break;

				case "pinlight" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var red = targetPixels.data[i];
							var green = targetPixels.data[i + 1];
							var blue = targetPixels.data[i + 2];
							var redSrc = sourcePixels.data[i];
							var greenSrc = sourcePixels.data[i + 1];
							var blueSrc = sourcePixels.data[i + 2];
							var redF = 2 * redSrc;
							var greenF = 2 * greenSrc;
							var blueF = 2 * blueSrc;
							var redF2 = 2 * redSrc - 256;
							var greenF2 = 2 * greenSrc - 256;
							var blueF2 = 2 * blueSrc - 256;
							if (redSrc < 128)
								if (red < redF) sourcePixels.data[i] = red;
								else	sourcePixels.data[i] = redF;
							else							
								if (red > redF2) sourcePixels.data[i] = red;
								else	sourcePixels.data[i] = redF;
							if (greenSrc < 128)
								if (green < greenF) sourcePixels.data[i + 1] = green;
								else	sourcePixels.data[i + 1] = greenF;
							else							
								if (green > greenF2) sourcePixels.data[i + 1] = green;
								else	sourcePixels.data[i + 1] = greenF;
							if (blueSrc < 128)
								if (blue < blueF) sourcePixels.data[i + 2] = blue;
								else	sourcePixels.data[i + 2] = blueF;
							else							
								if (blue > blueF2) sourcePixels.data[i + 2] = blue;
								else	sourcePixels.data[i + 2] = blueF;
						}
					}
					break;

				case "hardmix" : 
					for (var x = 0; x < targetPixels.width; x++) {
						for (var y = 0; y < targetPixels.height; y++) {
							var i = 4 * (y * targetPixels.width + x);
							var redSrc = sourcePixels.data[i];
							var greenSrc = sourcePixels.data[i + 1];
							var blueSrc = sourcePixels.data[i + 2];
							var redF = 2 * redSrc - 256;
							var greenF = 2 * greenSrc - 256;
							var blueF = 2 * blueSrc - 256;
							if (redSrc < 128)
								if (255 - ((255 - targetPixels.data[i]) << 8) / (2 * redSrc) < 128 || redSrc == 0) sourcePixels.data[i] = 0;
								else sourcePixels.data[i] = 255;
							else if (redF < 255 && (targetPixels.data[i] << 8) / (255 - redF) < 128) sourcePixels.data[i] = 0;
							else	sourcePixels.data[i] = 255;
							if (greenSrc < 128)
								if (255 - ((255 - targetPixels.data[i + 1]) << 8) / (2 * greenSrc) < 128 || greenSrc == 0) sourcePixels.data[i + 1] = 0;
								else sourcePixels.data[i + 1] = 255;
							else if (greenF < 255 && (targetPixels.data[i + 1] << 8) / (255 - greenF) < 128) sourcePixels.data[i + 1] = 0;
							else	sourcePixels.data[i + 1] = 255;
							if (blueSrc < 128)
								if (255 - ((255 - targetPixels.data[i + 2]) << 8) / (2 * blueSrc) < 128 || blueSrc == 0) sourcePixels.data[i + 2] = 0;
								else sourcePixels.data[i + 2] = 255;
							else if (blueF < 255 && (targetPixels.data[i + 2] << 8) / (255 -blueF) < 128) sourcePixels.data[i + 2] = 0;
							else	sourcePixels.data[i + 2] = 255;
						}
					}
					break;				
			}
			
			if ($this.nodeName == "IMG") {
				sourceCanvasContext.putImageData(sourcePixels, 0, 0);
				var dummy = sourceCanvasContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
				var targetStringData = sourceCanvas.toDataURL("image/png");
				$this.src = targetStringData;
			} else {
				$this.getContext("2d").putImageData(sourcePixels, 0, 0);
			}
			$(this).bind('hashchange', function() { blend($this); });
			$(options.object).bind('hashchange', function() { blend($this); });
		};
	
		return this.each(function() {
       			var $this = $(this).get(0);

			blend($this);
		});
		
	};
})(jQuery);
