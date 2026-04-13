var size = 0;
var placement = 'point';

var style_Little_Conestoga_IBI_Data = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("IBI_Condition_Category_Modified");
    var labelFont = "10px, sans-serif";
    var labelFill = "#000000";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    
    // Calculate scale factor based on resolution (zoom level)
    // Lower resolution = zoomed out, higher resolution = zoomed in
    var scaleFactor = 1;
    if (resolution < 5) {
        // Very zoomed in
        scaleFactor = 1.5;
    } else if (resolution < 20) {
        // Zoomed in
        scaleFactor = 1.3;
    } else if (resolution < 50) {
        // Medium zoom
        scaleFactor = 1.1;
    }
    
    function rules_Little_Conestoga_IBI_Data(feature, value) {
        var context = {
            feature: feature,
            variables: {}
        };
        
        var styles = [];
        
        // Get the IBI category and determine fill color
        var category = feature.get("IBI_Condition_Category_Modified");
        
        // Determine fill color based on IBI Condition Category
        var fillColor;
        if (category === 'Moderately Impaired') {
            fillColor = 'rgba(255,255,0,1.0)'; // Yellow - Moderately Impaired
        } else if (category === 'Highly Impaired') {
            fillColor = 'rgba(255,165,0,1.0)'; // Orange - Highly Impaired
        } else if (category === 'Severely Impaired') {
            fillColor = 'rgba(255,0,0,1.0)'; // Red - Severely Impaired
        } else {
            fillColor = 'rgba(128,128,128,1.0)'; // Gray - default/unknown
        }
        
        // Add main square point style based on IBI category
        styles.push(new ol.style.Style({
            image: new ol.style.RegularShape({
                points: 4,
                radius: (8 + size) * scaleFactor,
                angle: Math.PI / 4, // 45 degrees to make it a square (diamond rotated)
                displacement: [0, 0],
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,1.0)', // thin black border
                    lineDash: null,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    width: 1.2 * scaleFactor
                }),
                fill: new ol.style.Fill({
                    color: fillColor
                })
            }),
            text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
        }));
        
        return styles;
    }
    var style = rules_Little_Conestoga_IBI_Data(feature, value);
    return style;
};
