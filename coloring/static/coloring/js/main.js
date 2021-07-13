// demo image 
// var img = document.createElement('img');
// img.src = '../../static/coloring/images/draw_demo.png'


paper.install(window)
$(document).ready(function () {

    paper.setup('canvas');
    var path;
    var elem = 'paintbrush';
    var $curr_color = $('#c1') 

    // var raster = new paper.Raster({
    //     source : '../../static/coloring/images/draw_demo.png', 
    //     position: view.center
    // })

    utensils = {
        'paintbrush' : paintBrush,
        'pencil' : pencil,
        'pen' : pen,
        'eraser' : eraser,
        'undo' : undo,
        'redo' : redo
    }

    var history = [];
    
    var tool = new Tool({
        onMouseDown : paintBrush,
        onMouseDrag : onMouseDrag
    })

    $('.tool').click( function () {
        elem = $(this).attr('id');
        const selected = utensils[elem];
        tool.onMouseDrag = onMouseDrag;

        if ( elem === 'undo' || elem === 'redo') {
            selected();
        } else if (elem === 'eraser') {
            tool.onMouseDown = selected;
            tool.onMouseDrag = selected;
        }
        else {
            tool.onMouseDown = selected;
        }
    })

    // ALL TOOLS
    function paintBrush (event) {
        path = new Path({
            strokeColor : 'black',
            strokeWidth : '10',
        });
        path.add(event.point);
        tool.onMouseUp = null;
    }

    function pencil (event) {
        path = new Path({
            strokeColor : 'grey',
            strokeWidth : '2',
        });
        path.add(event.point);
        tool.onMouseUp = null;
    }
    
    function pen (event) {
        path = new Path({
            strokeColor : 'black',
            strokeWidth : '3',
        });
        path.add(event.point)
        tool.onMouseUp = make_smooth;
    }

    function eraser (event) {
        path = null;
        const layer = project.activeLayer.children;
        var n = layer.length;
        for (let i = 0; i < n; i++) {
            let curr = layer[i]; 
            curr.onClick = () => {
                history.push(curr)
                curr.remove();
            }
            curr.onMouseEnter = () => {
                history.push(curr)
                curr.remove();
            }
        }
        tool.onMouseUp = null;
    }

    function undo () {
        var layers = project.activeLayer.children;
        var n = layers.length;
        if (n > 0) {
            var topChild = layers[n - 1];
            history.push(topChild);
            topChild.remove();
        } 
    }

    function redo () {
        var layers = project.activeLayer;
        var n = history.length;
        if (n > 0) {
            layers.addChild(history[n - 1])
            history.pop();
        } 
    }

    // change color 
    $('.color-circle').click(function () {
        if (elem !== 'eraser' && elem !== 'redo' && 
        elem !== 'undo') {
            $curr_color = $(this);
            const select = $(this).css('background-color')
            tool.onMouseDown = (event) => {
                path = new Path({
                    strokeColor : select,
                    strokeWidth : path.strokeWidth,
                });
                path.add(event.point)
            }
        }
    })


    function onMouseDrag (event) {
        path.add(event.point);
    }

    // simplify path 
    function make_smooth(event) {
        path.simplify()
    }

    const $hue_slider = $('#hue-slider');
    $hue_slider.on('input', () => {
        if (path.strokeColor._canvasStyle) {
            var color = new Color(`${path.strokeColor._canvasStyle}`, $hue_slider[0].value, null, null)
            const new_hue = color.hsl();

            tool.onMouseDown = (event) => {
                path = new Path({
                    strokeColor : new_hue,
                    strokeWidth : path.strokeWidth,
                });
                path.add(event.point)
            }
            
            $curr_color.css('background-color', new_hue);
        }
    })

    const $sat_slider = $('#sat-slider');
    $sat_slider.on('input', () => {
        if (path.strokeColor._canvasStyle) {
            var color = new Color(`${path.strokeColor._canvasStyle}`, null, $sat_slider[0].value, null)
            const new_sat = color.hsl();
            
            tool.onMouseDown = (event) => {
                path = new Path({
                    strokeColor : new_sat,
                    strokeWidth : path.strokeWidth,
                });
                path.add(event.point)
            }

            $curr_color.css('background-color', new_sat);
        }
    })
   
    const $light_slider = $('#light-slider');
    $light_slider.on('input', () => {
        if (path.strokeColor._canvasStyle) {
            var color = new Color(`${path.strokeColor._canvasStyle}`, null, null, $light_slider[0].value,)
            var new_light = color.hsl();
            
            tool.onMouseDown = (event) => {
                path = new Path({
                    strokeColor : new_light,
                    strokeWidth : path.strokeWidth,
                });
                path.add(event.point)
            }
            
            $curr_color.css('background-color', new_light);
        }
    })

})

class Color {
    
    constructor(input_rgb, hue, sat, light) {
        this.rgb = input_rgb.substring(4, input_rgb.length-1).replace(/ /g, '').split(',');
        this.r = parseInt(this.rgb[0]);
        this.g = parseInt(this.rgb[1]);
        this.b = parseInt(this.rgb[2]);
        this.hue = hue;
        this.sat = sat;
        this.light = light;
        this.calcHSL();
    }

    hsl() {
        const {h,s,l} = this;
        console.log(`hsl(${h},${s}%,${l}%)`)
        return `hsl(${h},${s}%,${l}%)`
    }

    calcHSL() {
        let {r,g,b} = this;

        r /= 255;
        g /= 255;
        b /= 255;
    
        let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    
        if (delta == 0) {h = 0}
        else if (cmax == r) {h = ((g - b) / delta) % 6;}
        else if (cmax == g) {h = (b -r) / delta +2}
        else {h = (r - g) / delta + 4}
    
        h = Math.round(h * 60);
    
        if (h < 0) {h += 360};
    
        l = (cmax + cmin) / 2;
    
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        // note: can set new attributes 
        this.h = this.hue || h;
        this.s = this.sat || s;
        this.l = this.light || l;
    }
}


// more on classes 


// var p = new Path();

// function onMouseDown(event) {
//     p = new Path();
//     p.strokeColor = 'black';
//     p.strokeWidth = 5;
// }

// function onMouseDrag(event) {
//     p.add(event.point)
// }

// coloring page
// var mandala = {
//     item: null,
//     lastClicked: null,
//     filePath: '/static/coloring/images/mandala-freepik.svg'
// };

// color palette
// var cp = {
//     history: ["#000000"], // black selected by default
//     options: [],
//     $container: $('#color-palette')
// }

// myCustomInteraction()

// create a color palette with the given colors
// function createColorPalette(colors){

//     // create a swatch for each color
//     for (var i = colors.length - 1; i >= 0; i--) {
//         var $swatch = $("<div>").css("background-color", colors[i]).addClass("swatch");
//         $swatch.click(function(){
//             // add color to the color palette history
//                 cp.history.push($(this).css("background-color"));
//         });
//         cp.$container.append($swatch);
//     }
// }

// loads a set of colors from a json to create a color palette
// function getColorsCreatePalette(){
//     cp.$container.html(" ");
//     $.getJSON('/static/coloring/vendors/material/material-colors.json', function(colors){
//         var keys = Object.keys(colors);
//         for (var i = keys.length - 1; i >= 0; i--) {
//             cp.options.push(colors[keys[i]][500]);
//         }
//         createColorPalette(cp.options);
//     });
// }

// function init(){
    // paper.setup(canvas);
    // getColorsCreatePalette();
// myCustomInteraction();

    // paper.project.importSVG(mandala.filePath, function(item) {
    //     mandala.item = item._children["design-freepik"];
    //     paper.project.insertLayer(0,mandala.item);

    //     if (custom) {
    //         myCustomInteraction();
    //     } else {
    //         myGradientInteraction();
    //     }

    // });
// }

// Set up the mandala interactivity.
// init();
