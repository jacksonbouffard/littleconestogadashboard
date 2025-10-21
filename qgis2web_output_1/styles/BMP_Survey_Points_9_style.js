var size = 0;
var placement = 'point';

var style_BMP_Survey_Points_9 = function(feature, resolution){
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
    
    // Helper function to create implementation status halo
    function createImplementationHalo(feature) {
        var implementationStatus = feature.get("Implemented");
        if (implementationStatus === "yes") {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({
                        color: 'rgba(76,175,80,0.3)' // Light green halo for implemented
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(76,175,80,1.0)',
                        width: 2
                    })
                })
            });
        } else if (implementationStatus === "planned") {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({
                        color: 'rgba(255,235,59,0.2)' // Light yellow halo for planned
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255,235,59,0.6)',
                        width: 2
                    })
                })
            });
        }
        return null;
    }
    
    function rules_BMP_Survey_Points_9(feature, value) {
        var context = {
            feature: feature,
            variables: {}
        };
        
        var styles = [];
        
        // Add implementation halo if applicable
        var halo = createImplementationHalo(feature);
        if (halo) {
            styles.push(halo);
        }

        // Get the BMP category and create the main point style
        var category = feature.get("BMP_Category");
        
        // Add main point style based on BMP category
        styles.push(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 4 + size,
                displacement: [0, 0],
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,1.0)', // thin black border
                    lineDash: null,
                    lineCap: 'butt',
                    lineJoin: 'miter',
                    width: 1
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
    var style = rules_BMP_Survey_Points_9(feature, value);
    return style;
};
