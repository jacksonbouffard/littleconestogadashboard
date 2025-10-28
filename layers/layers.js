ol.proj.proj4.register(proj4);
//ol.proj.get("EPSG:3857").setExtent([-8518689.534796, 4861471.562612, -8479081.772871, 4885801.127879]);
var wms_layers = [];


        var lyr_OpenStreetMap_0 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        var lyr_GoogleSatellite_2 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });

        var lyr_EsriWorldImagery_3 = new ol.layer.Tile({
            'title': 'Esri World Imagery',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: 'Tiles © Esri',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            })
        });

        var lyr_EsriImageryLabels_4 = new ol.layer.Tile({
            'title': 'Reference Layer',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: 'Tiles © Esri',
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'
            })
        });
var format_Little_Conestoga_Streams_3 = new ol.format.GeoJSON();
var features_Little_Conestoga_Streams_3 = format_Little_Conestoga_Streams_3.readFeatures(json_Little_Conestoga_Streams_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Little_Conestoga_Streams_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Little_Conestoga_Streams_3.addFeatures(features_Little_Conestoga_Streams_3);
var lyr_Little_Conestoga_Streams_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Little_Conestoga_Streams_3, 
                style: style_Little_Conestoga_Streams_3,
                title: 'Little Conestoga Streams',
                popuplayertitle: 'Little Conestoga Streams',
                interactive: false,
                title: '<img src="styles/legend/Little_Conestoga_Streams_3.png" /> Little Conestoga Streams'
            });
var format_Riparian_Forest_Buffer_4 = new ol.format.GeoJSON();
var features_Riparian_Forest_Buffer_4 = format_Riparian_Forest_Buffer_4.readFeatures(json_Riparian_Forest_Buffer_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Riparian_Forest_Buffer_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Riparian_Forest_Buffer_4.addFeatures(features_Riparian_Forest_Buffer_4);
var lyr_Riparian_Forest_Buffer_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Riparian_Forest_Buffer_4, 
                style: style_Riparian_Forest_Buffer_4,
                title: 'Riparian Forest Buffer',
                popuplayertitle: 'Riparian Forest Buffer',
                interactive: false,
    title: 'Riparian Forest Buffer<br />\
    <img src="styles/legend/Riparian_Forest_Buffer_4_0.png" /> Forested<br />\
    <img src="styles/legend/Riparian_Forest_Buffer_4_1.png" /> Unforested<br />' });
var format_Parcel_Level_Projects_5 = new ol.format.GeoJSON();
var features_Parcel_Level_Projects_5 = format_Parcel_Level_Projects_5.readFeatures(json_Parcel_Level_Projects_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Parcel_Level_Projects_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Parcel_Level_Projects_5.addFeatures(features_Parcel_Level_Projects_5);
var lyr_Parcel_Level_Projects_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Parcel_Level_Projects_5, 
                style: style_Parcel_Level_Projects_5,
                title: 'Parcel Level Projects',
                popuplayertitle: 'Parcel Level Projects',
                interactive: true,
    title: 'Parcel Level Projects<br />\
    <img src="styles/legend/Parcel_Level_Projects_5_0.png" /> 1.1 - 7<br />\
    <img src="styles/legend/Parcel_Level_Projects_5_1.png" /> 7 - 16<br />\
    <img src="styles/legend/Parcel_Level_Projects_5_2.png" /> 16 - 23<br />\
    <img src="styles/legend/Parcel_Level_Projects_5_3.png" /> 23 - 38<br />\
    <img src="styles/legend/Parcel_Level_Projects_5_4.png" /> 38 - 57.2<br />' });
var format_HUC12_Boundaries_6 = new ol.format.GeoJSON();
var features_HUC12_Boundaries_6 = format_HUC12_Boundaries_6.readFeatures(json_HUC12_Boundaries_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_HUC12_Boundaries_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_HUC12_Boundaries_6.addFeatures(features_HUC12_Boundaries_6);
var lyr_HUC12_Boundaries_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_HUC12_Boundaries_6, 
                style: style_HUC12_Boundaries_6,
                title: 'HUC12 Boundaries',
                popuplayertitle: 'HUC12 Boundaries',
                interactive: false,
                title: '<img src="styles/legend/HUC12_Boundaries_6.png" /> HUC12 Boundaries'
            });
var format_Smallsheds_7 = new ol.format.GeoJSON();
var features_Smallsheds_7 = format_Smallsheds_7.readFeatures(json_Smallsheds_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Smallsheds_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Smallsheds_7.addFeatures(features_Smallsheds_7);
var lyr_Smallsheds_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Smallsheds_7, 
                style: style_Smallsheds_7,
                title: 'Small Watersheds',
                popuplayertitle: 'Small Watersheds',
                interactive: false,
                title: '<img src="styles/legend/Smallsheds_7.png" /> Smallsheds'
            });
var format_SRBC_Focus_Areas_8 = new ol.format.GeoJSON();
var features_SRBC_Focus_Areas_8 = format_SRBC_Focus_Areas_8.readFeatures(json_SRBC_Focus_Areas_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_SRBC_Focus_Areas_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_SRBC_Focus_Areas_8.addFeatures(features_SRBC_Focus_Areas_8);
var lyr_SRBC_Focus_Areas_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_SRBC_Focus_Areas_8, 
                style: style_SRBC_Focus_Areas_8,
                title: 'SRBC Focus Areas',
                popuplayertitle: 'SRBC Focus Areas',
                interactive: false,
                title: '<img src="styles/legend/SRBC_Focus_Areas_8.png" /> SRBC Focus Areas'
            });
var format_Delisting_Catchments = new ol.format.GeoJSON();
var features_Delisting_Catchments = format_Delisting_Catchments.readFeatures(json_Delisting_Catchments_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Delisting_Catchments = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Delisting_Catchments.addFeatures(features_Delisting_Catchments);
var lyr_Delisting_Catchments = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Delisting_Catchments, 
                style: style_Delisting_Catchments,
                popuplayertitle: 'Delisting Catchments',
                interactive: false,
                title: 'Delisting Catchments'
            });
var format_Municipality_Boundaries = new ol.format.GeoJSON();
var features_Municipality_Boundaries = format_Municipality_Boundaries.readFeatures(json_Municipality_Boundaries_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Municipality_Boundaries = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Municipality_Boundaries.addFeatures(features_Municipality_Boundaries);
var lyr_Municipality_Boundaries = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Municipality_Boundaries, 
                style: style_Municipality_Boundaries,
                popuplayertitle: 'Municipality Boundaries',
                interactive: false,
                title: 'Municipality Boundaries'
            });
var format_BMP_Survey_Points_9 = new ol.format.GeoJSON();
var features_BMP_Survey_Points_9 = format_BMP_Survey_Points_9.readFeatures(json_BMP_Survey_Points_9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_BMP_Survey_Points_9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_BMP_Survey_Points_9.addFeatures(features_BMP_Survey_Points_9);
var lyr_BMP_Survey_Points_9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_BMP_Survey_Points_9, 
                style: style_BMP_Survey_Points_9,
                title: 'BMP Survey Points',
                popuplayertitle: 'BMP Survey Points',
                interactive: true,
    title: 'BMP Survey Points<br />\
    <img src="styles/legend/BMP_Survey_Points_9_0.png" /> Agricultural BMPs<br />\
    <img src="styles/legend/BMP_Survey_Points_9_1.png" /> Stormwater BMPs<br />\
    <img src="styles/legend/BMP_Survey_Points_9_2.png" /> Implemented BMPs<br />' });

// Critical Recharge Area Footprint
var lyr_critical_recharge_area_footprint = new ol.layer.Vector({
    declutter: false,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(json_critical_recharge_area_footprint_0, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    }),
    style: style_critical_recharge_area_footprint,
    popuplayertitle: "Critical Recharge Area Footprint",
    interactive: false,
    title: 'Critical Recharge Area Footprint'
});

lyr_OpenStreetMap_0.setVisible(false);lyr_GoogleSatellite_2.setVisible(false);lyr_EsriWorldImagery_3.setVisible(true);lyr_EsriImageryLabels_4.setVisible(false);lyr_Little_Conestoga_Streams_3.setVisible(false);lyr_Riparian_Forest_Buffer_4.setVisible(false);lyr_Parcel_Level_Projects_5.setVisible(true);lyr_HUC12_Boundaries_6.setVisible(true);lyr_Smallsheds_7.setVisible(false);lyr_SRBC_Focus_Areas_8.setVisible(false);lyr_Delisting_Catchments.setVisible(false);lyr_Municipality_Boundaries.setVisible(false);lyr_BMP_Survey_Points_9.setVisible(true);lyr_critical_recharge_area_footprint.setVisible(false);
// Create layer groups
var basemapGroup = new ol.layer.Group({
    title: 'Base Maps',
    layers: [
        lyr_OpenStreetMap_0,
        lyr_GoogleSatellite_2,
        lyr_EsriWorldImagery_3,
        lyr_EsriImageryLabels_4
    ]
});

var boundariesGroup = new ol.layer.Group({
    title: 'Boundaries',
    layers: [
        lyr_critical_recharge_area_footprint,
        lyr_HUC12_Boundaries_6,
        lyr_Smallsheds_7,
        lyr_SRBC_Focus_Areas_8,
        lyr_Delisting_Catchments,
        lyr_Municipality_Boundaries
    ]
});

var featuresGroup = new ol.layer.Group({
    title: 'Features',
    layers: [
        lyr_Little_Conestoga_Streams_3,
        lyr_Riparian_Forest_Buffer_4,
        lyr_Parcel_Level_Projects_5,
        lyr_BMP_Survey_Points_9
    ]
});

var layersList = [basemapGroup, boundariesGroup, featuresGroup];
lyr_Little_Conestoga_Streams_3.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'gnis_id': 'gnis_id', 'stream_name': 'stream_name', 'ATTAINS_ID': 'ATTAINS_ID', 'tributary_id': 'tributary_id', 'trib_drain_x_dd': 'trib_drain_x_dd', 'trib_drain_y_dd': 'trib_drain_y_dd', 'stream_origin_x_dd': 'stream_origin_x_dd', 'stream_origin_y_dd': 'stream_origin_y_dd', 'Mile_tributary_id': 'Mile_tributary_id', 'Number_Tributary_From_Origin': 'Number_Tributary_From_Origin', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Riparian_Forest_Buffer_4.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'gnis_id': 'gnis_id', 'stream_name': 'stream_name', 'ATTAINS_ID': 'ATTAINS_ID', 'tributary_id': 'tributary_id', 'trib_drain_x_dd': 'trib_drain_x_dd', 'trib_drain_y_dd': 'trib_drain_y_dd', 'stream_origin_x_dd': 'stream_origin_x_dd', 'stream_origin_y_dd': 'stream_origin_y_dd', 'Mile_tributary_id': 'Mile_tributary_id', 'Number_Tributary_From_Origin': 'Number_Tributary_From_Origin', 'Forest_Status': 'Forest_Status', 'Sq_Meter': 'Sq_Meter', 'HUC12_Code': 'HUC12', 'HUC12_Name': 'Name', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Parcel_Level_Projects_5.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'Landowner_parcel': 'Landowner (Parcel)', 'Unique_Landowner_ID': 'Unique_Landowner_ID', 'FarmerTracker': 'FarmerTracker', 'Impervious_Sq_Meters': 'Impervious_Sq_Meters', 'Area_Sq_Meters': 'Area_Sq_Meters', 'Prop_Impervious': 'Prop_Impervious', 'Universal_ID': 'Universal ID', 'BMP_ID': 'BMP_ID', 'Source': 'Data Source', 'Source_Year': 'Source_Year', 'Project_Description': 'Project Description', 'Local_ID': 'Local_ID', 'Project_Types': 'BMP Type', 'PM__acres_': 'PM (acres)', 'GW__acres_treated_': 'GW (acres treated)', 'T_D__acres_treated_': 'T&D (acres treated)', 'CSC__acres_planted_': 'CSC (acres planted)', 'NT__acres_': 'NT (acres)', 'RB__linear_feet_': 'RB (linear feet)', 'SR__linear_feet_': 'SR (linear feet)', 'FR__linear_feet_': 'FR (linear feet)', 'CC__acres_': 'CC (Acres)', 'WR__acres_': 'WR (acres)', 'Other': 'Other', 'FarmerTracker_1': 'FarmerTracker', 'HUC12_Code': 'HUC12 Code', 'HUC12_Name': 'HUC 12 Name', 'Priority_Subwatershed': 'Priority_Subwatershed', 'Municipality': 'Municipality', 'Crop_Summary': 'Crop_Summary', 'Cover_Crop_Summary': 'Cover_Crop_Summary', 'Cover_Crop_Classification': 'Cover_Crop_Classification', 'Outreach_Group': 'Outreach Group', 'Catchment_IBI_Category': 'Catchment_IBI_Category', 'Priority_Score': 'Priority_Score', 'Project_Progress_Status': 'Has this project been completed/implemented?', 'Address_parcel': 'Address (Parcel)', 'Address_parcel_1': 'Address (Parcel)', 'SRBC_Area_Order': 'SRBC_Area_Order', 'SRBC_Focus_Area_Name': 'SRBC_Focus_Area_Name', 'SRBC_Focus_Purpose': 'SRBC_Focus_Purpose', 'Recharge_Potential_Value': 'Recharge_Potential_Value', 'In_Critical_Recharge': 'In_Critical_Recharge', 'Preservation_Management': 'Preservation_Management', 'Preservation_Type': 'Preservation_Type', 'Preservation_Name': 'Preservation_Name', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_HUC12_Boundaries_6.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'name': 'name', 'huc12': 'huc12', 'areaacres': 'areaacres', 'areasqkm': 'areasqkm', 'GlobalID': 'GlobalID', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Smallsheds_7.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'SDE_SmallSheds_AREA': 'AREA', 'PERIMETER': 'PERIMETER', 'WRDS_': 'WRDS_', 'HUC': 'HUC', 'NAME': 'NAME', 'HEIRLEVEL': 'HEIRLEVEL', 'COMMENTS': 'COMMENTS', 'HEIRCODE': 'HEIRCODE', 'DRAINAGE': 'DRAINAGE', 'SWP': 'SWP', 'CHAP93': 'CHAP93', 'ID': 'ID', 'AGG': 'AGG', 'Area_Sq_Meters': 'Area_Sq_Meters', 'Sq_Meters_Impervious': 'Sq_Meters_Impervious', 'Prop_Area_Impervious': 'Prop_Area_Impervious', 'Impervious_Multiplier': 'Impervious_Multiplier', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_SRBC_Focus_Areas_8.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'FocusAreaN': 'FocusAreaN', 'FocusArea': 'FocusArea', 'Purpose': 'Purpose', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Delisting_Catchments.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'NAME': 'NAME', 'County': 'County', 'Acres': 'Acres', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_Municipality_Boundaries.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'MUNICIPAL_NAME': 'MUNICIPAL_NAME', 'CLASS_OF_MUNIC': 'CLASS_OF_MUNIC', 'COUNTY_NAME': 'COUNTY_NAME', 'Shape_Length': 'Shape_Length', 'Shape_Area': 'Shape_Area', });
lyr_BMP_Survey_Points_9.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'Project_Type': 'Project_Type', 'Project_Description': 'Project_Description', 'Notes': 'Notes', 'Source': 'Source', 'WAP_Num': 'WAP_Num', 'Implemented': 'Implemented', 'notVisible': 'Not Visible From Road', 'fieldNotes': 'Field Notes', 'Visited': 'Visited', 'dateVisited': 'Date', 'P_ID': 'P_ID', 'bmpNeeded': 'BMP Needed', 'priority': 'priority', 'GlobalID_Text': 'GlobalID_Text', 'image_urls': 'image_urls', 'image_count': 'image_count', 'image_url': 'image_url', 'Unique_Landowner_ID': 'Unique_Landowner_ID', 'Universal_ID': 'Universal ID', 'ParcelID_parcel': 'ParcelID (Parcel)', 'Landowner_parcel_1': 'Landowner (Parcel)', 'Address_parcel': 'Address (Parcel)', 'Municipality': 'Municipality', 'LC_BMP_ID': 'LC_BMP_ID', 'Smallshed': 'Smallshed', 'Prop_Area_Impervious': 'Prop_Area_Impervious', 'Impervious_Multiplier': 'Impervious_Multiplier', 'Base_SW_Score': 'Base_SW_Score', 'Final_SW_Score': 'Final_SW_Score', 'BMP_Category': 'BMP_Category', 'Recharge_Potential_Value': 'Recharge_Potential_Value', 'SRBC_Area_Order': 'SRBC_Area_Order', 'SRBC_Focus_Name': 'SRBC_Focus_Name', 'SRBC_Focus_Purpose': 'SRBC_Focus_Purpose', 'In_Critical_Recharge': 'In_Critical_Recharge', 'Preservation_Status': 'Preservation_Status', 'Preservation_Type': 'Preservation_Type', 'Preservation_Name': 'Preservation_Name', 'Catchment_IBI_Category': 'Catchment_IBI_Category', 'Priority_Subwatershed': 'Priority_Subwatershed', 'image_binary': 'image_binary', });
lyr_Little_Conestoga_Streams_3.set('fieldImages', {'OBJECTID': 'TextEdit', 'gnis_id': 'TextEdit', 'stream_name': 'TextEdit', 'ATTAINS_ID': 'TextEdit', 'tributary_id': 'TextEdit', 'trib_drain_x_dd': 'TextEdit', 'trib_drain_y_dd': 'TextEdit', 'stream_origin_x_dd': 'TextEdit', 'stream_origin_y_dd': 'TextEdit', 'Mile_tributary_id': 'TextEdit', 'Number_Tributary_From_Origin': 'Range', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Riparian_Forest_Buffer_4.set('fieldImages', {'OBJECTID': 'TextEdit', 'gnis_id': 'TextEdit', 'stream_name': 'TextEdit', 'ATTAINS_ID': 'TextEdit', 'tributary_id': 'TextEdit', 'trib_drain_x_dd': 'TextEdit', 'trib_drain_y_dd': 'TextEdit', 'stream_origin_x_dd': 'TextEdit', 'stream_origin_y_dd': 'TextEdit', 'Mile_tributary_id': 'TextEdit', 'Number_Tributary_From_Origin': 'Range', 'Forest_Status': 'TextEdit', 'Sq_Meter': 'TextEdit', 'HUC12_Code': 'TextEdit', 'HUC12_Name': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Parcel_Level_Projects_5.set('fieldImages', {'OBJECTID': 'TextEdit', 'Landowner_parcel': 'TextEdit', 'Unique_Landowner_ID': 'Range', 'FarmerTracker': 'TextEdit', 'Impervious_Sq_Meters': 'TextEdit', 'Area_Sq_Meters': 'TextEdit', 'Prop_Impervious': 'TextEdit', 'Universal_ID': 'TextEdit', 'BMP_ID': 'TextEdit', 'Source': 'TextEdit', 'Source_Year': 'TextEdit', 'Project_Description': 'TextEdit', 'Local_ID': 'Range', 'Project_Types': 'TextEdit', 'PM__acres_': 'TextEdit', 'GW__acres_treated_': 'TextEdit', 'T_D__acres_treated_': 'TextEdit', 'CSC__acres_planted_': 'TextEdit', 'NT__acres_': 'TextEdit', 'RB__linear_feet_': 'TextEdit', 'SR__linear_feet_': 'TextEdit', 'FR__linear_feet_': 'Range', 'CC__acres_': 'TextEdit', 'WR__acres_': 'TextEdit', 'Other': 'TextEdit', 'FarmerTracker_1': 'TextEdit', 'HUC12_Code': 'TextEdit', 'HUC12_Name': 'TextEdit', 'Priority_Subwatershed': 'TextEdit', 'Municipality': 'TextEdit', 'Crop_Summary': 'TextEdit', 'Cover_Crop_Summary': 'TextEdit', 'Cover_Crop_Classification': 'TextEdit', 'Outreach_Group': 'TextEdit', 'Catchment_IBI_Category': 'TextEdit', 'Priority_Score': 'TextEdit', 'Project_Progress_Status': 'Range', 'Address_parcel': 'TextEdit', 'Address_parcel_1': 'TextEdit', 'SRBC_Area_Order': 'Range', 'SRBC_Focus_Area_Name': 'TextEdit', 'SRBC_Focus_Purpose': 'TextEdit', 'Recharge_Potential_Value': 'TextEdit', 'In_Critical_Recharge': 'Range', 'Preservation_Management': 'TextEdit', 'Preservation_Type': 'TextEdit', 'Preservation_Name': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_HUC12_Boundaries_6.set('fieldImages', {'OBJECTID': 'TextEdit', 'name': 'TextEdit', 'huc12': 'TextEdit', 'areaacres': 'TextEdit', 'areasqkm': 'TextEdit', 'GlobalID': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Smallsheds_7.set('fieldImages', {'OBJECTID': 'TextEdit', 'SDE_SmallSheds_AREA': 'TextEdit', 'PERIMETER': 'TextEdit', 'WRDS_': 'Range', 'HUC': 'Range', 'NAME': 'TextEdit', 'HEIRLEVEL': 'Range', 'COMMENTS': 'TextEdit', 'HEIRCODE': 'TextEdit', 'DRAINAGE': 'TextEdit', 'SWP': 'TextEdit', 'CHAP93': 'TextEdit', 'ID': 'TextEdit', 'AGG': 'TextEdit', 'Area_Sq_Meters': 'TextEdit', 'Sq_Meters_Impervious': 'TextEdit', 'Prop_Area_Impervious': 'TextEdit', 'Impervious_Multiplier': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_SRBC_Focus_Areas_8.set('fieldImages', {'OBJECTID': 'TextEdit', 'FocusAreaN': 'Range', 'FocusArea': 'TextEdit', 'Purpose': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Delisting_Catchments.set('fieldImages', {'OBJECTID': 'TextEdit', 'NAME': 'TextEdit', 'County': 'TextEdit', 'Acres': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_Municipality_Boundaries.set('fieldImages', {'OBJECTID': 'TextEdit', 'MUNICIPAL_NAME': 'TextEdit', 'CLASS_OF_MUNIC': 'TextEdit', 'COUNTY_NAME': 'TextEdit', 'Shape_Length': 'TextEdit', 'Shape_Area': 'TextEdit', });
lyr_BMP_Survey_Points_9.set('fieldImages', {'OBJECTID': 'TextEdit', 'Project_Type': 'TextEdit', 'Project_Description': 'TextEdit', 'Notes': 'TextEdit', 'Source': 'TextEdit', 'WAP_Num': 'TextEdit', 'Implemented': 'TextEdit', 'notVisible': 'TextEdit', 'fieldNotes': 'TextEdit', 'Visited': 'TextEdit', 'dateVisited': 'DateTime', 'P_ID': 'TextEdit', 'bmpNeeded': 'TextEdit', 'priority': 'TextEdit', 'GlobalID_Text': 'TextEdit', 'image_urls': 'TextEdit', 'image_count': 'Range', 'image_url': 'TextEdit', 'Unique_Landowner_ID': 'Range', 'Universal_ID': 'TextEdit', 'ParcelID_parcel': 'TextEdit', 'Landowner_parcel_1': 'TextEdit', 'Address_parcel': 'TextEdit', 'Municipality': 'TextEdit', 'LC_BMP_ID': 'Range', 'Smallshed': 'TextEdit', 'Prop_Area_Impervious': 'TextEdit', 'Impervious_Multiplier': 'TextEdit', 'Base_SW_Score': 'Range', 'Final_SW_Score': 'TextEdit', 'BMP_Category': 'TextEdit', 'Recharge_Potential_Value': 'TextEdit', 'SRBC_Area_Order': 'Range', 'SRBC_Focus_Name': 'TextEdit', 'SRBC_Focus_Purpose': 'TextEdit', 'In_Critical_Recharge': 'Range', 'Preservation_Status': 'TextEdit', 'Preservation_Type': 'TextEdit', 'Preservation_Name': 'TextEdit', 'Catchment_IBI_Category': 'TextEdit', 'Priority_Subwatershed': 'TextEdit', 'image_binary': 'Range', });
lyr_Little_Conestoga_Streams_3.set('fieldLabels', {'OBJECTID': 'no label', 'gnis_id': 'no label', 'stream_name': 'no label', 'ATTAINS_ID': 'no label', 'tributary_id': 'no label', 'trib_drain_x_dd': 'no label', 'trib_drain_y_dd': 'no label', 'stream_origin_x_dd': 'no label', 'stream_origin_y_dd': 'no label', 'Mile_tributary_id': 'no label', 'Number_Tributary_From_Origin': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_Riparian_Forest_Buffer_4.set('fieldLabels', {'OBJECTID': 'no label', 'gnis_id': 'no label', 'stream_name': 'no label', 'ATTAINS_ID': 'no label', 'tributary_id': 'no label', 'trib_drain_x_dd': 'no label', 'trib_drain_y_dd': 'no label', 'stream_origin_x_dd': 'no label', 'stream_origin_y_dd': 'no label', 'Mile_tributary_id': 'no label', 'Number_Tributary_From_Origin': 'no label', 'Forest_Status': 'no label', 'Sq_Meter': 'no label', 'HUC12_Code': 'no label', 'HUC12_Name': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_Parcel_Level_Projects_5.set('fieldLabels', {'OBJECTID': 'hidden field', 'Landowner_parcel': 'inline label - visible with data', 'Unique_Landowner_ID': 'inline label - visible with data', 'FarmerTracker': 'inline label - visible with data', 'Impervious_Sq_Meters': 'hidden field', 'Area_Sq_Meters': 'hidden field', 'Prop_Impervious': 'hidden field', 'Universal_ID': 'inline label - visible with data', 'BMP_ID': 'inline label - visible with data', 'Source': 'inline label - visible with data', 'Source_Year': 'inline label - visible with data', 'Project_Description': 'inline label - visible with data', 'Local_ID': 'inline label - visible with data', 'Project_Types': 'inline label - visible with data', 'PM__acres_': 'inline label - visible with data', 'GW__acres_treated_': 'inline label - visible with data', 'T_D__acres_treated_': 'inline label - visible with data', 'CSC__acres_planted_': 'inline label - visible with data', 'NT__acres_': 'inline label - visible with data', 'RB__linear_feet_': 'inline label - visible with data', 'SR__linear_feet_': 'inline label - visible with data', 'FR__linear_feet_': 'inline label - visible with data', 'CC__acres_': 'inline label - visible with data', 'WR__acres_': 'inline label - visible with data', 'Other': 'inline label - visible with data', 'FarmerTracker_1': 'inline label - visible with data', 'HUC12_Code': 'hidden field', 'HUC12_Name': 'hidden field', 'Priority_Subwatershed': 'inline label - visible with data', 'Municipality': 'inline label - visible with data', 'Crop_Summary': 'hidden field', 'Cover_Crop_Summary': 'hidden field', 'Cover_Crop_Classification': 'hidden field', 'Outreach_Group': 'hidden field', 'Catchment_IBI_Category': 'inline label - visible with data', 'Priority_Score': 'inline label - visible with data', 'Project_Progress_Status': 'hidden field', 'Address_parcel': 'inline label - visible with data', 'Address_parcel_1': 'hidden field', 'SRBC_Area_Order': 'hidden field', 'SRBC_Focus_Area_Name': 'inline label - visible with data', 'SRBC_Focus_Purpose': 'hidden field', 'Recharge_Potential_Value': 'inline label - visible with data', 'In_Critical_Recharge': 'inline label - visible with data', 'Preservation_Management': 'inline label - visible with data', 'Preservation_Type': 'inline label - visible with data', 'Preservation_Name': 'inline label - visible with data', 'Shape_Length': 'hidden field', 'Shape_Area': 'hidden field', });
lyr_HUC12_Boundaries_6.set('fieldLabels', {'OBJECTID': 'no label', 'name': 'no label', 'huc12': 'no label', 'areaacres': 'no label', 'areasqkm': 'no label', 'GlobalID': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_Smallsheds_7.set('fieldLabels', {'OBJECTID': 'no label', 'SDE_SmallSheds_AREA': 'no label', 'PERIMETER': 'no label', 'WRDS_': 'no label', 'HUC': 'no label', 'NAME': 'no label', 'HEIRLEVEL': 'no label', 'COMMENTS': 'no label', 'HEIRCODE': 'no label', 'DRAINAGE': 'no label', 'SWP': 'no label', 'CHAP93': 'no label', 'ID': 'no label', 'AGG': 'no label', 'Area_Sq_Meters': 'no label', 'Sq_Meters_Impervious': 'no label', 'Prop_Area_Impervious': 'no label', 'Impervious_Multiplier': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_SRBC_Focus_Areas_8.set('fieldLabels', {'OBJECTID': 'no label', 'FocusAreaN': 'no label', 'FocusArea': 'no label', 'Purpose': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_Delisting_Catchments.set('fieldLabels', {'OBJECTID': 'no label', 'NAME': 'no label', 'County': 'no label', 'Acres': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_Municipality_Boundaries.set('fieldLabels', {'OBJECTID': 'no label', 'MUNICIPAL_NAME': 'no label', 'CLASS_OF_MUNIC': 'no label', 'COUNTY_NAME': 'no label', 'Shape_Length': 'no label', 'Shape_Area': 'no label', });
lyr_BMP_Survey_Points_9.set('fieldLabels', {'OBJECTID': 'hidden field', 'Project_Type': 'inline label - always visible', 'Project_Description': 'inline label - visible with data', 'Notes': 'inline label - visible with data', 'Source': 'inline label - visible with data', 'WAP_Num': 'inline label - visible with data', 'Implemented': 'inline label - visible with data', 'notVisible': 'hidden field', 'fieldNotes': 'inline label - visible with data', 'Visited': 'hidden field', 'dateVisited': 'hidden field', 'P_ID': 'hidden field', 'bmpNeeded': 'hidden field', 'priority': 'inline label - visible with data', 'GlobalID_Text': 'hidden field', 'image_urls': 'hidden field', 'image_count': 'hidden field', 'image_url': 'inline label - visible with data', 'Unique_Landowner_ID': 'inline label - visible with data', 'Universal_ID': 'inline label - visible with data', 'ParcelID_parcel': 'inline label - visible with data', 'Landowner_parcel_1': 'inline label - visible with data', 'Address_parcel': 'inline label - visible with data', 'Municipality': 'inline label - visible with data', 'LC_BMP_ID': 'hidden field', 'Smallshed': 'inline label - visible with data', 'Prop_Area_Impervious': 'inline label - visible with data', 'Impervious_Multiplier': 'inline label - visible with data', 'Base_SW_Score': 'hidden field', 'Final_SW_Score': 'inline label - visible with data', 'BMP_Category': 'inline label - visible with data', 'Recharge_Potential_Value': 'inline label - visible with data', 'SRBC_Area_Order': 'hidden field', 'SRBC_Focus_Name': 'inline label - visible with data', 'SRBC_Focus_Purpose': 'hidden field', 'In_Critical_Recharge': 'inline label - visible with data', 'Preservation_Status': 'inline label - visible with data', 'Preservation_Type': 'hidden field', 'Preservation_Name': 'inline label - visible with data', 'Catchment_IBI_Category': 'inline label - visible with data', 'Priority_Subwatershed': 'inline label - visible with data', 'image_binary': 'hidden field', });
lyr_BMP_Survey_Points_9.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});