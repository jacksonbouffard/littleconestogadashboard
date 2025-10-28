var size = 0;
var placement = 'point';

var style_Delisting_Catchments = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(255,127,0,1.0)',
            lineDash: null,
            lineCap: 'square',
            lineJoin: 'bevel',
            width: 2.0
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,127,0,0.0)'
        })
    })];

    return style;
};
