var size = 0;
var placement = 'point';

var style_Municipality_Boundaries = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,0,0,1.0)',
            lineDash: [15, 10],
            lineCap: 'square',
            lineJoin: 'bevel',
            width: 4.0
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0,0,0,0)'
        })
    })];

    return style;
};
