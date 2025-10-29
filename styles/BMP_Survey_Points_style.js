var size = 0;
var placement = 'point';

var style_BMP_Survey_Points = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("var value = '';");
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
    
    // Helper function to create implementation status halo
    function createImplementationHalo(feature, scale) {
        var implementationStatus = feature.get("Implemented");
        if (implementationStatus === "yes") {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8 * scale,
                    fill: new ol.style.Fill({
                        color: 'rgba(0,255,0,0.25)' // Neon green halo for implemented
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,255,0,1.0)',
                        width: 3 * scale
                    })
                })
            });
        } else if (implementationStatus === "planned") {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8 * scale,
                    fill: new ol.style.Fill({
                        color: 'rgba(255,128,0,0.25)' // Neon orange halo for planned
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,128,0,1.0)', // Neon orange ring
                        width: 3 * scale
                    })
                })
            });
        }
        return null;
    }
    
    function rules_BMP_Survey_Points(feature, value) {
        var context = {
            feature: feature,
            variables: {}
        };
        
        var styles = [];
        
        // Add implementation halo if applicable
        var halo = createImplementationHalo(feature, scaleFactor);
        if (halo) {
            styles.push(halo);
        }

        // Get the BMP category and create the main point style
        var category = feature.get("BMP_Category");
        
        // Add main point style based on BMP category
        styles.push(new ol.style.Style({
            image: new ol.style.Circle({
                radius: (5 + size) * scaleFactor,
                displacement: [0, 0],
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,1.0)', // thin black border
                    lineDash: null,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    width: 1.2 * scaleFactor
                }),
                fill: new ol.style.Fill({
                    color: category === 'Agricultural' ? 
                        'rgba(76,175,80,1.0)' : // Green for Agricultural
                        'rgba(33,150,243,1.0)'  // Blue for Stormwater
                })
            }),
            text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
        }));
        
        return styles;
    }
    var style = rules_BMP_Survey_Points(feature, value);
    return style;
};
