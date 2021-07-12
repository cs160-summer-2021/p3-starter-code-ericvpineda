var p = new Path();

function onMouseDown(event) {
    p = new Path();
    p.strokeColor = 'black';
    p.strokeWidth = 5;
}

function onMouseDrag(event) {
    p.add(event.point)
}

// window.onload = function() {
//     var canvas = document.getElementById('myCanvas');

//     // coloring page
//     var mandala = {
//         item: null,
//         lastClicked: null,
//         filePath: '/static/coloring/images/mandala-freepik.svg'
//     };

//     // color palette
//     var cp = {
//         history: ["#000000"], // black selected by default
//         options: [],
//         $container: $('#color-palette')
//     }

//     function myCustomInteraction() {
//         var tool = new paper.Tool();

//         tool.onMouseDown = function (event) {
//             var hit = mandala.item.hitTest(event.point, { tolerance: 10, fill: true });
//             if (hit) {
//                     // Color pallette keeps track of the full history of colors, though we
//                     // only color in with the most-recent color.
//                 hit.item.fillColor = cp.history[cp.history.length - 1];
//             }
//         }
//     }

//     // create a color palette with the given colors
//     function createColorPalette(colors){

//         // create a swatch for each color
//         for (var i = colors.length - 1; i >= 0; i--) {
//             var $swatch = $("<div>").css("background-color", colors[i])
//                                .addClass("swatch");
//             $swatch.click(function(){
//                 // add color to the color palette history
//                   cp.history.push($(this).css("background-color"));
//             });
//             cp.$container.append($swatch);
//         }
//     }

//     // loads a set of colors from a json to create a color palette
//     function getColorsCreatePalette(){
//         cp.$container.html(" ");
//         $.getJSON('/static/coloring/vendors/material/material-colors.json', function(colors){
//             var keys = Object.keys(colors);
//             for (var i = keys.length - 1; i >= 0; i--) {
//                 cp.options.push(colors[keys[i]][500]);
//             }
//             createColorPalette(cp.options);
//         });
//     }

//     function init(custom){
//         paper.setup(canvas);
//         getColorsCreatePalette();

//         paper.project.importSVG(mandala.filePath, function(item) {
//             mandala.item = item._children["design-freepik"];
//             paper.project.insertLayer(0,mandala.item);

//             if (custom) {
//                 myCustomInteraction();
//             } else {
//                 myGradientInteraction();
//             }

//         });
//     }

//     // Set up the mandala interactivity.
//     init(true);
// }