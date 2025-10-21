// Style for Critical Recharge Area Footprint
var style_critical_recharge_area_footprint = function(feature, resolution) {
    // Create canvas pattern for hatch fill
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 8;
    canvas.height = 8;
    
    // Draw diagonal hatch pattern
    context.strokeStyle = 'rgba(255, 20, 147, 0.2)'; // Neon pink with low opacity
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, 8);
    context.lineTo(8, 0);
    context.stroke();
    
    var pattern = context.createPattern(canvas, 'repeat');
    
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255, 20, 147, 1)', // Neon pink
            width: 3.0
        }),
        fill: new ol.style.Fill({
            color: pattern || 'rgba(255, 20, 147, 0.15)' // Fallback to semi-transparent pink
        })
    });
    
    return [style];
};
