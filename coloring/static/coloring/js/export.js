var canvas_box = document.querySelector('#canvas');
var img = document.createElement('img');
img.src = '../../static/coloring/images/draw_demo.png'
img.id = 'draw_demo'
canvas_box.append(img)

var raster = new paper.Raster('draw_demo')
raster.position = view.center;


  // allow panning image 
function onMouseDrag(event) {
    paper.view.center = event.downPoint.subtract(
        event.point).add(paper.view.center);
};


$('canvas').on('mousewheel', function(event) {

    var prev_zoom = paper.view.zoom;
    var prev_center = paper.view.center;
    var curr_mouse = view.viewToProject(
        new Point(event.offsetX, event.offsetY));

    // update zoom view 
    var FACTOR = 1.05;
    if (event.deltaY > 0) {
        view.zoom = prev_zoom * FACTOR;
    } else {
        view.zoom = prev_zoom / FACTOR;
    } 

    // Update position view.
    paper.view.center += (curr_mouse - prev_center) * (1 - (prev_zoom / view.zoom));
   
});