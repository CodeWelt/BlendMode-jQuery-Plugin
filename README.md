<b>BlendMode jQuery Plugin</b>

This plugin will process a given HTML5 canvas or image element using one of the offered Blend-Modes by the Blend-Layer parameter.
The parameter can be a String specifying a solid color or HTML image and canvas element. The mode determines how the two defined layers will blend into each other. The result is saved, so running the script twice will reprocess the first result. Two simple examples are part of the downloadable zip file.
Demo and downloads are available at http://codewelt.com/blendmode

<b>Basic Usage</b>

<pre>
jQuery:
$("#sourceImage").blendmode({
	"mode" : "pinlight",
	"object" : "#FF0000"
	});

HTML:
<img id="sourceImage" src="sourceImage.png" alt="The source image for blending"/>
</pre>

<b>Parameters</b>

• mode (string)
The Blend-Mode may be one of "normal", "multiply", "lighten", "darken", "lineardodge", "linearburn", "linearlight", "vividlight", "pinlight", "hardmix", "lightercolor", "darkercolor", "difference", "screen", "exclusion", "overlay", "softlight", "hardlight", "colordodge", "colorburn".

• object (image)
This may either be a HTML5 canvas or image node.

• scaletofit (bool)
Scales the Blend-Layer to the size of the sourceImage. Value between true and false.
