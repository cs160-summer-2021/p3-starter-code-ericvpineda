paper.install(window)
$(document).ready( async function () {

    await paper.setup('canvas');
    var path;
    var elem = 'paintbrush';

    // enlarge current cup 
    var $curr_color_cup = $('#c1');
    $curr_color_cup.css('max-width', '65px').css('min-height', '65px');
    $curr_color_cup.css('transition', 'ease-in 0.2s');
    var curr_color = $curr_color_cup.css('background-color');

    // tools 
    var $curr_tool = $('#paintbrush')
    var $prev_tool = $curr_tool;

    // range slider variables 
    const $hue_slider = $('#hue-slider');
    const $sat_slider = $('#sat-slider');
    const $light_slider = $('#light-slider');

    // create canvas image 
    var canvas_box = document.querySelector('#canvas');
    var img = document.createElement('img');
    img.src = '../../static/coloring/images/draw_demo.png'
    img.id = 'draw_demo'
    canvas_box.append(img)
    var raster = new paper.Raster('draw_demo')
    raster.position = view.center;

    // functions
    utensils = {
        'paintbrush' : paintBrush,
        'pencil' : pencil,
        'pen' : pen,
        'eraser' : eraser,
        'undo' : undo,
        'redo' : redo,
        'trash' : trash,
        'center-img' : center_img,
        'move' : paperDrag
    }

    // keep track of previous layers 
    var history = [];
    
    // create start tool 
    var tool = new Tool({
        onMouseDown : paintBrush,
        onMouseDrag : onMouseDrag
    })

    $('.tool-container').click( function () {
        
        elem = $(this).attr('id');
        
        // decrease prev selected tool 
        if (elem !== 'undo' && elem !== 'redo' && elem !== 'trash') {
            $curr_tool.css({
                'min-width' : '3.3rem',
                'min-height' : '3.3rem',
                'transition' : 'ease-in 0.2s'
            })
            
            if ($prev_tool) {
                $prev_tool.css({
                    'min-width' : '3.3rem',
                    'min-height' : '3.3rem',
                    'transition' : 'ease-in 0.2s'
                })
            }
        } else {
            $prev_tool = $curr_tool;
        }

        $curr_tool = $(this)
        const selected = utensils[elem];
        tool.onMouseDrag = onMouseDrag;

        if ( elem === 'undo' || elem === 'redo' || elem == 'trash' || elem == 'center-img') {
            selected();
        } else {

            if (elem === 'eraser') {
                tool.onMouseDown = selected;
                tool.onMouseDrag = selected;

            } else if(elem === 'move') {
                tool.onMouseDrag = paperDrag
            }
            else {
                tool.onMouseDown = selected;
            }
            $(this).css({
                'min-width' : '70px',
                'min-height' : '70px'
            });
        }
    })


    // ALL TOOLS
    function paintBrush (event) {
        path = new Path({
            strokeColor : curr_color,
            strokeWidth : '8',
        });
        path.add(event.point);
        tool.onMouseUp = null;
    }

    function pencil (event) {
        path = new Path({
            strokeColor : curr_color,
            strokeWidth : '2',
        });
        path.add(event.point);
        tool.onMouseUp = null;
    }
    
    function pen (event) {
        path = new Path({
            strokeColor : curr_color,
            strokeWidth : '3',
        });
        path.add(event.point)
        tool.onMouseUp = make_smooth;
    }

    function eraser () {
        path = null;
        const layer = project.activeLayer.children;
        var n = layer.length;
        for (let i = 0; i < n; i++) {
            let curr = layer[i]; 
            if (curr._image) {
                continue;
            }
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

    function paperDrag(event) {
        paper.view.center = event.downPoint.subtract(
            event.point).add(paper.view.center);
    };


    function undo () {
        var layers = project.activeLayer;
        var n = history.length;
        if (n > 0) {
            layers.addChild(history[n - 1])
            history.pop();
        } 
    }

    function redo () {
        var layers = project.activeLayer.children;
        var n = layers.length;
        if (n > 1) {
            console.log('here')
            var topChild = layers[n - 1];
            history.push(topChild);
            topChild.remove();
        } 
    }
    
    // note: how to save total delete ??
    function trash () {
        project.clear()
        project.activeLayer.addChild(raster);
    }

    const old_zoom = paper.view.zoom;
    const old_center = paper.view.center;

    function center_img () {
        paper.view.zoom = old_zoom;
        paper.view.center = old_center;
    }   

    // change color 
    $('.color-circle').click(function () {
        if (elem !== 'eraser' && elem !== 'redo' && elem !== 'undo') {
            $curr_color_cup.css({
                'max-width': '50px',
                'max-height': '50px',
                'min-height' : '50px'
            });
            $curr_color_cup = $(this);
            $(this).css('transition', 'ease-in 0.2s');
            const select = $(this).css('background-color')
            tool.onMouseDown = (event) => {
                path = new Path({
                    strokeColor : select,
                    strokeWidth : path.strokeWidth,
                });
                path.add(event.point)
            }
            
            const color = new Color(select, null, null, null);
            // console.log($hue_slider)
            $hue_slider.val(color.h);
            $sat_slider.val(color.s);
            $light_slider.val(color.l);
            
            $curr_color_cup.css('max-width', '65px');
            $curr_color_cup.css('min-height', '65px');
        }
    })


    function onMouseDrag (event) {
        path.add(event.point);
    }

    // simplify path 
    function make_smooth(event) {
        path.simplify()
    }

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
            
            $curr_color_cup.css('background-color', new_hue);
        }
    })
  
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

            $curr_color_cup.css('background-color', new_sat);
        }
    })
   
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
            
            $curr_color_cup.css('background-color', new_light);
        }
    })

    $('canvas').on('mousewheel', function(event) {

        var prev_zoom = paper.view.zoom;
        var prev_center = paper.view.center;
        var curr_mouse = view.viewToProject(
            new Point(event.offsetX, event.offsetY));

        // update zoom view 
        var FACTOR = 1.05;
        if (event.deltaY > 0) {
            paper.view.zoom = prev_zoom * FACTOR;
        } else {
            paper.view.zoom = prev_zoom / FACTOR;
        } 

        // Update position view.
        var x = (curr_mouse.x - prev_center.x) * (1 - (prev_zoom / paper.view.zoom))
        var y = (curr_mouse.y - prev_center.y) * (1 - (prev_zoom / paper.view.zoom))
        paper.view.setCenter(paper.view.center.x + x, paper.view.center.y + y);
    
    });
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
        this.convert_hsl();
    }

    hsl() {
        const {h,s,l} = this;
        return `hsl(${h},${s}%,${l}%)`
    }

    convert_hsl() {

        let {r,g,b} = this;

        r /= 255;
        g /= 255;
        b /= 255;
        
        var max_val = Math.max(r,g,b);
        var min_val = Math.min(r,g,b);
        var d = max_val - min_val, h = 0, s = 0, l = 0;
    
        if (d == 0) {
            h = 0
        } else if (r == max_val) {
            h = ((g - b) / d) % 6;
        } else if (g == max_val) {
            h = (b -r) / d +2
        } else {
            h = (r - g) / d + 4
        }
    
        h = Math.round(h * 60);
        h = h < 0 ? h + 360 : h
    
        l = (max_val + min_val) / 2;
    
        if (d != 0) {
            s = d / (1 - Math.abs(2 * l - 1));
        } else {
            s = 0
        }
    
        s = +(100 * s).toFixed(1);
        l = +(100 * l).toFixed(1);

        // note: can set new attributes 
        this.h = this.hue || h;
        this.s = this.sat || s;
        this.l = this.light || l;
    }
}


