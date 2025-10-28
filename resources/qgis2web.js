
// Function to close splash screen
function closeSplash() {
  var splashScreen = document.getElementById('splash-screen');
  var mapElement = document.getElementById('map');
  
  if (splashScreen) {
    splashScreen.classList.add('hidden');
    // Remove blur from map and controls
    if (mapElement) {
      mapElement.classList.remove('blurred');
    }
    // Remove body classes to re-enable scrolling and remove blur from controls
    document.body.classList.remove('no-scroll');
    document.body.classList.remove('splash-active');
    // Remove from DOM after animation completes
    setTimeout(function() {
      splashScreen.style.display = 'none';
    }, 500);
  }
}

// Function to open lightbox with full-size image
function openLightbox(imageSrc) {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox && lightboxImg && imageSrc) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
  }
}

// Function to close lightbox
function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Add blur effect to map and controls on page load, prevent scrolling
  var mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.classList.add('blurred');
  }
  // Add body classes to prevent scrolling and blur controls
  document.body.classList.add('no-scroll');
  document.body.classList.add('splash-active');
  
  // Wait until layersList is defined
  if (typeof layersList === 'undefined') {
    // Try again after a short delay
    setTimeout(arguments.callee, 50);
    return;
  }

  // Map initialization (must be after layersList is defined)
  var map = new ol.Map({
      target: 'map',
      renderer: 'canvas',
      layers: layersList,
      view: new ol.View({
           maxZoom: 28, minZoom: 1, projection: new ol.proj.Projection({
              code: 'EPSG:3857',
              //extent: [-8509656.459800, 4858735.980300, -8492834.209900, 4888337.389300],
              units: 'm'})
      })
  });

  // Inject utility bar and toggle button
  var utilityBar = document.createElement('div');
  utilityBar.className = 'utility-bar collapsed';
  utilityBar.innerHTML = `
      <div class="utility-bar-section" id="utility-bar-both-filters">
          <h3>Both (Points & Parcels)</h3>
          <div class="filter-group">
              <label class="collapsible-label" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>Delisting Catchments:</span> <span class="collapse-icon">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-priority-subwatershed">
                  <label><input type="checkbox" value="Co76"> Co76 - Indian Run Headwaters North</label>
                  <label><input type="checkbox" value="Co77"> Co77 -  Indian Run Headwaters South</label>
                  <label><input type="checkbox" value="Co99"> Co99 - Swarr Run Headwaters</label>
                  <label><input type="checkbox" value="Nonpriority Area"> Nonpriority Area</label>
              </div>
          </div>
          <div class="filter-group">
              <label class="collapsible-label-srbc" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>SRBC Focus Area:</span> <span class="collapse-icon-srbc">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-srbc-focus">
                  <label><input type="checkbox" value="1: Swarr Run Headwaters (Including Millers Run)"> 1: Swarr Run Headwaters (Including Millers Run)</label>
                  <label><input type="checkbox" value="2: LitConestoga Headwaters / Bachman Run"> 2: LitConestoga Headwaters / Bachman Run</label>
                  <label><input type="checkbox" value="3: Granite Run / UNT"> 3: Granite Run / UNT</label>
                  <label><input type="checkbox" value="4: West Branch Headwaters / Indian Run"> 4: West Branch Headwaters / Indian Run</label>
                  <label><input type="checkbox" value="5: East Petersburg"> 5: East Petersburg</label>
                  <label><input type="checkbox" value="Nonpriority Area"> Nonpriority Area</label>
              </div>
          </div>
          <div class="filter-group">
              <label class="collapsible-label-conservation" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>Conservation Land:</span> <span class="collapse-icon-conservation">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-conservation-land">
                  <label><input type="checkbox" value="Agricultural Easement"> Agricultural Easement</label>
                  <label><input type="checkbox" value="Local Park"> Local Park</label>
                  <label><input type="checkbox" value="Nonconservation Area"> Nonconservation Area</label>
              </div>
          </div>
          <div class="filter-group">
              <label class="collapsible-label-municipality" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>Municipality:</span> <span class="collapse-icon-municipality">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-municipality">
                  <label><input type="checkbox" value="EAST HEMPFIELD"> East Hempfield</label>
                  <label><input type="checkbox" value="EAST PETERSBURG"> East Petersburg</label>
                  <label><input type="checkbox" value="LANCASTER"> Lancaster</label>
                  <label><input type="checkbox" value="LITITZ"> Lititz</label>
                  <label><input type="checkbox" value="MANHEIM"> Manheim</label>
                  <label><input type="checkbox" value="MANOR"> Manor</label>
                  <label><input type="checkbox" value="MILLERSVILLE"> Millersville</label>
                  <label><input type="checkbox" value="MOUNTVILLE"> Mountville</label>
                  <label><input type="checkbox" value="PENN"> Penn</label>
                  <label><input type="checkbox" value="WARWICK"> Warwick</label>
                  <label><input type="checkbox" value="WEST HEMPFIELD"> West Hempfield</label>
              </div>
          </div>
          <div class="filter-group">
              <label style="display: flex; justify-content: space-between; align-items: center;">
                  <span>In Critical Recharge:</span>
                  <span style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <span id="recharge-label">OFF</span>
                      <label class="switch">
                          <input type="checkbox" id="critical-recharge-toggle">
                          <span class="switch-slider"></span>
                      </label>
                  </span>
              </label>
          </div>
          <div class="filter-group">
              <label style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Project Type:</span>
                  <span style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <span id="logic-label">OR</span>
                      <label class="switch">
                          <input type="checkbox" id="project-type-logic">
                          <span class="switch-slider"></span>
                      </label>
                  </span>
              </label>
              <div class="checkbox-group" id="filter-project-type">
                  <label><input type="checkbox" value="SWR"> SWR - Stormwater Retrofit</label>
                  <label><input type="checkbox" value="RB"> RB - Riparian Buffer</label>
                  <label><input type="checkbox" value="BI"> BI - Bioinfiltration</label>
                  <label><input type="checkbox" value="SR"> SR - Stream Restoration</label>
                  <label><input type="checkbox" value="BSR"> BSR - Bioswale Retrofit</label>
                  <label><input type="checkbox" value="FR"> FR - Floodplain Restoration</label>
                  <label><input type="checkbox" value="PP"> PP - Permeable Pavement</label>
                  <label><input type="checkbox" value="SBF"> SBF - Stream Bank Fencing</label>
                  <label><input type="checkbox" value="GW"> GW - Grassed Waterway</label>
                  <label><input type="checkbox" value="WR"> WR - Wetland Restoration</label>
                  <label><input type="checkbox" value="BRC"> BRC - Barnyard Runoff Control</label>
                  <label><input type="checkbox" value="CL"> CL - Conservation Landscaping</label>
                  <label><input type="checkbox" value="NT"> NT - No-Till</label>
                  <label><input type="checkbox" value="PM"> PM - Pasture Management</label>
                  <label><input type="checkbox" value="T&D"> T&D - Terrace & Diversion</label>
              </div>
          </div>
      </div>
      
      <div class="utility-bar-section" id="utility-bar-point-filters">
          <h3>Point Filters</h3>
          <div class="filter-group">
              <label class="collapsible-label-bmp" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>BMP Category:</span> <span class="collapse-icon-bmp">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-bmp-category">
                  <label><input type="checkbox" value="Stormwater"> Stormwater</label>
                  <label><input type="checkbox" value="Agricultural"> Agricultural</label>
              </div>
          </div>
          <div class="filter-group">
              <label for="filter-sw-score">Stormwater Priority Score:</label>
              <div class="slider-container">
                  <input type="range" id="filter-sw-score" min="0" max="8" value="0" step="0.5">
                  <div class="slider-values">
                      <span id="sw-score-min">0</span>
                      <span id="sw-score-value">0+</span>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="utility-bar-section" id="utility-bar-parcel-filters">
          <h3>Parcel Filters</h3>
          <div class="filter-group">
              <label for="filter-priority-score">Priority Score:</label>
              <div class="slider-container">
                  <input type="range" id="filter-priority-score" min="0" max="60" value="0" step="1">
                  <div class="slider-values">
                      <span id="priority-score-min">0</span>
                      <span id="priority-score-value">0+</span>
                  </div>
              </div>
          </div>
      </div>
  `;
  document.body.appendChild(utilityBar);
  
  // Prevent scroll propagation from utility bar to map
  utilityBar.addEventListener('wheel', function(e) {
    var atTop = utilityBar.scrollTop === 0;
    var atBottom = utilityBar.scrollTop + utilityBar.clientHeight >= utilityBar.scrollHeight;
    
    // If scrolling up at top or down at bottom, prevent propagation
    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
      e.preventDefault();
    }
    
    // Always stop propagation to prevent map from scrolling
    e.stopPropagation();
  }, { passive: false });
  
  // Prevent scroll propagation from splash screen to map
  var splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.addEventListener('wheel', function(e) {
      e.stopPropagation();
    }, { passive: true });
  }
  
  // Filter function
  function applyFilters() {
    console.log('applyFilters called');
    var swScoreThreshold = parseFloat(document.getElementById('filter-sw-score').value);
    var priorityScoreThreshold = parseFloat(document.getElementById('filter-priority-score').value);
    
    // Get critical recharge filter state (false = Off/0, true = On/1)
    var criticalRechargeOn = document.getElementById('critical-recharge-toggle').checked;
    
    // Get selected conservation land types from checkboxes
    var selectedConservationTypes = [];
    var conservationCheckboxes = document.querySelectorAll('#filter-conservation-land input[type="checkbox"]:checked');
    conservationCheckboxes.forEach(function(checkbox) {
      selectedConservationTypes.push(checkbox.value);
    });
    
    // Get selected municipalities from checkboxes
    var selectedMunicipalities = [];
    var municipalityCheckboxes = document.querySelectorAll('#filter-municipality input[type="checkbox"]:checked');
    municipalityCheckboxes.forEach(function(checkbox) {
      selectedMunicipalities.push(checkbox.value);
    });
    
    // Get selected priority subwatersheds from checkboxes
    var selectedSubwatersheds = [];
    var subwatershedCheckboxes = document.querySelectorAll('#filter-priority-subwatershed input[type="checkbox"]:checked');
    subwatershedCheckboxes.forEach(function(checkbox) {
      selectedSubwatersheds.push(checkbox.value);
    });
    
    // Get selected SRBC focus areas from checkboxes
    var selectedSrbcAreas = [];
    var srbcCheckboxes = document.querySelectorAll('#filter-srbc-focus input[type="checkbox"]:checked');
    srbcCheckboxes.forEach(function(checkbox) {
      selectedSrbcAreas.push(checkbox.value);
    });
    
    // Get selected BMP categories from checkboxes
    var selectedBmpCategories = [];
    var bmpCategoryCheckboxes = document.querySelectorAll('#filter-bmp-category input[type="checkbox"]:checked');
    bmpCategoryCheckboxes.forEach(function(checkbox) {
      selectedBmpCategories.push(checkbox.value);
    });
    
    // Get selected project types from checkboxes
    var selectedProjectTypes = [];
    var checkboxes = document.querySelectorAll('#filter-project-type input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
      selectedProjectTypes.push(checkbox.value);
    });
    
    // Get AND/OR logic (false = OR, true = AND)
    var useAndLogic = document.getElementById('project-type-logic').checked;
    
    console.log('Filter values:', {swScoreThreshold, priorityScoreThreshold, selectedSubwatersheds, selectedSrbcAreas, selectedBmpCategories, selectedProjectTypes, useAndLogic, criticalRechargeOn, selectedConservationTypes});
    
    // Get the layers
    var pointsLayer = null;
    var parcelsLayer = null;
    
    // Find the layers in the featuresGroup
    console.log('layersList:', layersList);
    console.log('layersList length:', layersList.length);
    console.log('layersList[2]:', layersList[2]);
    
    // The featuresGroup is at index 2, but we need to access its layers differently
    var featuresGroup = layersList[2];
    if (featuresGroup) {
      console.log('Features group found:', featuresGroup);
      // OpenLayers groups have getLayers() method
      var layers = featuresGroup.getLayers ? featuresGroup.getLayers().getArray() : [];
      console.log('Found layers:', layers.length);
      layers.forEach(function(layer) {
        var title = layer.get('title');
        console.log('Layer title:', title);
        // Use startsWith to handle legend HTML in titles
        if (title && title.startsWith('BMP Survey Points')) {
          pointsLayer = layer;
          console.log('Found points layer');
        } else if (title && title.startsWith('Parcel Level Projects')) {
          parcelsLayer = layer;
          console.log('Found parcels layer');
        }
      });
    }
    console.log('Layers found - points:', !!pointsLayer, 'parcels:', !!parcelsLayer);
    
    // Filter points
    if (pointsLayer) {
      var pointSource = pointsLayer.getSource();
      var pointFeatures = pointSource.getFeatures();
      console.log('Filtering', pointFeatures.length, 'point features');
      var hiddenCount = 0;
      
      // Log first feature for debugging
      if (pointFeatures.length > 0) {
        var firstProps = pointFeatures[0].getProperties();
        console.log('Sample feature properties:', {
          Final_SW_Score: firstProps.Final_SW_Score,
          Priority_Subwatershed: firstProps.Priority_Subwatershed,
          BMP_Category: firstProps.BMP_Category,
          Project_Type: firstProps.Project_Type
        });
      }
      
      pointFeatures.forEach(function(feature) {
        var props = feature.getProperties();
        var show = true;
        
        // Filter by Final_SW_Score (minimum value filter - show if >= threshold)
        if (props.Final_SW_Score !== null && props.Final_SW_Score !== undefined) {
          if (props.Final_SW_Score < swScoreThreshold) {
            show = false;
          }
        }
        
        // Filter by Priority_Subwatershed (if any are selected)
        if (selectedSubwatersheds.length > 0) {
          if (!props.Priority_Subwatershed || selectedSubwatersheds.indexOf(props.Priority_Subwatershed) === -1) {
            show = false;
          }
        }
        
        // Filter by SRBC_Focus_Name (if any are selected)
        if (selectedSrbcAreas.length > 0) {
          if (!props.SRBC_Focus_Name || selectedSrbcAreas.indexOf(props.SRBC_Focus_Name) === -1) {
            show = false;
          }
        }
        
        // Filter by BMP_Category (if any are selected)
        if (selectedBmpCategories.length > 0) {
          if (!props.BMP_Category || selectedBmpCategories.indexOf(props.BMP_Category) === -1) {
            show = false;
          }
        }
        
        // Filter by In_Critical_Recharge (if toggle is on, only show features with value = 1)
        if (criticalRechargeOn) {
          if (props.In_Critical_Recharge !== 1 && props.In_Critical_Recharge !== 1.0) {
            show = false;
          }
        }
        
        // Filter by Conservation Land (if any types are selected)
        if (selectedConservationTypes.length > 0) {
          var isNonconservation = !props.Preservation_Type || props.Preservation_Type === null || props.Preservation_Type === '';
          var hasNonconservationSelected = selectedConservationTypes.indexOf('Nonconservation Area') !== -1;
          
          if (isNonconservation) {
            // Feature has no conservation land - only show if "Nonconservation Area" is selected
            if (!hasNonconservationSelected) {
              show = false;
            }
          } else {
            // Feature has conservation land - check if it matches selected types
            if (selectedConservationTypes.indexOf(props.Preservation_Type) === -1 && !hasNonconservationSelected) {
              show = false;
            } else if (selectedConservationTypes.indexOf(props.Preservation_Type) === -1 && hasNonconservationSelected) {
              // Only "Nonconservation Area" is selected, but this feature has conservation land
              var onlyNonconservation = selectedConservationTypes.length === 1 && hasNonconservationSelected;
              if (onlyNonconservation) {
                show = false;
              }
            }
          }
        }
        
        // Filter by Municipality (if any municipalities are selected)
        if (selectedMunicipalities.length > 0) {
          if (selectedMunicipalities.indexOf(props.Municipality) === -1) {
            show = false;
          }
        }
        
        // Filter by Project_Type (if any types are selected)
        if (selectedProjectTypes.length > 0) {
          // Check if the feature's Project_Type matches any selected type
          if (!props.Project_Type || selectedProjectTypes.indexOf(props.Project_Type) === -1) {
            show = false;
          }
        }
        
        // Set feature visibility
        feature.setStyle(show ? null : new ol.style.Style({}));
        if (!show) hiddenCount++;
      });
      console.log('Hidden', hiddenCount, 'points');
      
      // Force layer refresh
      pointSource.changed();
      pointsLayer.changed();
    } else {
      console.log('Points layer not found!');
    }
    
    // Filter parcels
    if (parcelsLayer) {
      var parcelSource = parcelsLayer.getSource();
      var parcelFeatures = parcelSource.getFeatures();
      console.log('Filtering', parcelFeatures.length, 'parcel features');
      var hiddenCount = 0;
      parcelFeatures.forEach(function(feature) {
        var props = feature.getProperties();
        var show = true;
        
        // Filter by Priority_Score (minimum value filter - show if >= threshold)
        if (props.Priority_Score !== null && props.Priority_Score !== undefined) {
          if (props.Priority_Score < priorityScoreThreshold) {
            show = false;
          }
        }
        
        // Filter by Priority_Subwatershed (if any are selected)
        if (selectedSubwatersheds.length > 0) {
          if (!props.Priority_Subwatershed || selectedSubwatersheds.indexOf(props.Priority_Subwatershed) === -1) {
            show = false;
          }
        }
        
        // Filter by SRBC_Focus_Area_Name (if any are selected)
        if (selectedSrbcAreas.length > 0) {
          if (!props.SRBC_Focus_Area_Name || selectedSrbcAreas.indexOf(props.SRBC_Focus_Area_Name) === -1) {
            show = false;
          }
        }
        
        // Filter by In_Critical_Recharge (if toggle is on, only show features with value = 1)
        if (criticalRechargeOn) {
          if (props.In_Critical_Recharge !== 1 && props.In_Critical_Recharge !== 1.0) {
            show = false;
          }
        }
        
        // Filter by Conservation Land (if any types are selected)
        if (selectedConservationTypes.length > 0) {
          var isNonconservation = !props.Preservation_Type || props.Preservation_Type === null || props.Preservation_Type === '';
          var hasNonconservationSelected = selectedConservationTypes.indexOf('Nonconservation Area') !== -1;
          
          if (isNonconservation) {
            // Feature has no conservation land - only show if "Nonconservation Area" is selected
            if (!hasNonconservationSelected) {
              show = false;
            }
          } else {
            // Feature has conservation land - check if it matches selected types
            if (selectedConservationTypes.indexOf(props.Preservation_Type) === -1 && !hasNonconservationSelected) {
              show = false;
            } else if (selectedConservationTypes.indexOf(props.Preservation_Type) === -1 && hasNonconservationSelected) {
              // Only "Nonconservation Area" is selected, but this feature has conservation land
              var onlyNonconservation = selectedConservationTypes.length === 1 && hasNonconservationSelected;
              if (onlyNonconservation) {
                show = false;
              }
            }
          }
        }
        
        // Filter by Municipality (if any municipalities are selected)
        if (selectedMunicipalities.length > 0) {
          if (selectedMunicipalities.indexOf(props.Municipality) === -1) {
            show = false;
          }
        }
        
        // Filter by Project_Types (if any types are selected)
        // Parcels have comma-separated values in Project_Types field
        if (selectedProjectTypes.length > 0) {
          if (!props.Project_Types) {
            show = false;
          } else {
            // Split comma-separated types and check based on AND/OR logic
            var parcelTypes = props.Project_Types.split(',').map(function(t) { return t.trim(); });
            
            if (useAndLogic) {
              // AND logic: parcel must have ALL selected types
              var hasAllTypes = true;
              for (var i = 0; i < selectedProjectTypes.length; i++) {
                if (parcelTypes.indexOf(selectedProjectTypes[i]) === -1) {
                  hasAllTypes = false;
                  break;
                }
              }
              if (!hasAllTypes) {
                show = false;
              }
            } else {
              // OR logic: parcel must have ANY selected type
              var hasMatch = false;
              for (var i = 0; i < selectedProjectTypes.length; i++) {
                if (parcelTypes.indexOf(selectedProjectTypes[i]) !== -1) {
                  hasMatch = true;
                  break;
                }
              }
              if (!hasMatch) {
                show = false;
              }
            }
          }
        }
        
        // Set feature visibility
        feature.setStyle(show ? null : new ol.style.Style({}));
        if (!show) hiddenCount++;
      });
      console.log('Hidden', hiddenCount, 'parcels');
      
      // Force layer refresh
      parcelSource.changed();
      parcelsLayer.changed();
    } else {
      console.log('Parcels layer not found!');
    }
    
    // Handle SRBC Focus Areas layer
    var srbcLayer = null;
    var boundariesGroup = layersList[1]; // SRBC layer is in boundaries group
    if (boundariesGroup) {
      console.log('Boundaries group found:', boundariesGroup);
      var boundaryLayers = boundariesGroup.getLayers ? boundariesGroup.getLayers().getArray() : [];
      console.log('Boundary layers count:', boundaryLayers.length);
      boundaryLayers.forEach(function(layer) {
        var title = layer.get('title');
        console.log('Checking boundary layer title:', title);
        // Use indexOf to handle HTML in the title
        if (title && title.indexOf('SRBC Focus Areas') !== -1) {
          srbcLayer = layer;
          console.log('Found SRBC Focus Areas layer');
        }
      });
    }
    
    if (srbcLayer) {
      // Filter out "Nonpriority Area" since it doesn't exist as a boundary polygon
      var srbcAreasToShow = selectedSrbcAreas.filter(function(area) {
        return area !== 'Nonpriority Area';
      });
      
      // Turn layer on if any actual SRBC areas are selected, off if none
      if (srbcAreasToShow.length > 0) {
        srbcLayer.setVisible(true);
        console.log('SRBC layer turned ON, filtering to:', srbcAreasToShow);
        
        // Filter the SRBC layer features
        var srbcSource = srbcLayer.getSource();
        var srbcFeatures = srbcSource.getFeatures();
        console.log('Total SRBC features:', srbcFeatures.length);
        
        srbcFeatures.forEach(function(feature) {
          var props = feature.getProperties();
          var showFeature = false;
          
          console.log('SRBC Feature FocusArea:', props.FocusArea);
          
          // Check if this feature's FocusArea is in the selected list
          if (props.FocusArea && srbcAreasToShow.indexOf(props.FocusArea) !== -1) {
            showFeature = true;
            console.log('  -> Showing this feature');
          }
          
          // Set feature visibility
          feature.setStyle(showFeature ? null : new ol.style.Style({}));
        });
        
        srbcLayer.changed();
      } else {
        srbcLayer.setVisible(false);
        console.log('SRBC layer turned OFF (no selections or only Nonpriority Area selected)');
      }
    } else {
      console.log('SRBC Focus Areas layer not found!');
    }
    
    // Handle Critical Recharge Area Footprint layer visibility
    var criticalRechargeLayer = null;
    if (boundariesGroup) {
      var boundaryLayers = boundariesGroup.getLayers ? boundariesGroup.getLayers().getArray() : [];
      boundaryLayers.forEach(function(layer) {
        var title = layer.get('title');
        if (title && title.indexOf('Critical Recharge') !== -1) {
          criticalRechargeLayer = layer;
        }
      });
      
      if (criticalRechargeLayer) {
        // Show layer only when toggle is on
        criticalRechargeLayer.setVisible(criticalRechargeOn);
        console.log('Critical Recharge Area layer', criticalRechargeOn ? 'ON' : 'OFF');
      } else {
        console.log('Critical Recharge Area layer not found!');
      }
    }
    
    // Handle Delisting Catchments layer visibility and filtering
    var delistingCatchmentsLayer = null;
    if (boundariesGroup) {
      var boundaryLayers = boundariesGroup.getLayers ? boundariesGroup.getLayers().getArray() : [];
      boundaryLayers.forEach(function(layer) {
        var title = layer.get('title');
        if (title && title.indexOf('Delisting Catchments') !== -1) {
          delistingCatchmentsLayer = layer;
        }
      });
      
      if (delistingCatchmentsLayer) {
        console.log('Found Delisting Catchments layer');
        
        // Filter out "Nonpriority Area" from display logic
        var catchmentsToShow = selectedSubwatersheds.filter(function(area) {
          return area !== 'Nonpriority Area';
        });
        
        // Turn layer on if any catchments are selected, off if none
        if (catchmentsToShow.length > 0) {
          delistingCatchmentsLayer.setVisible(true);
          console.log('Delisting Catchments layer turned ON, filtering to:', catchmentsToShow);
          
          // Filter the layer features
          var source = delistingCatchmentsLayer.getSource();
          var features = source.getFeatures();
          console.log('Total Delisting Catchments features:', features.length);
          
          features.forEach(function(feature) {
            var props = feature.getProperties();
            var showFeature = false;
            
            console.log('Delisting Catchment Feature NAME:', props.NAME);
            
            // Check if this feature's NAME is in the selected list
            if (props.NAME && selectedSubwatersheds.indexOf(props.NAME) !== -1) {
              showFeature = true;
              console.log('  -> Showing this feature');
            }
            
            // Set feature visibility
            feature.setStyle(showFeature ? null : new ol.style.Style({}));
          });
          
          source.changed();
        } else {
          delistingCatchmentsLayer.setVisible(false);
          console.log('Delisting Catchments layer turned OFF (no selections or only Nonpriority Area selected)');
        }
      } else {
        console.log('Delisting Catchments layer not found!');
      }
    }
    
    // Handle Municipality Boundaries layer visibility and filtering
    var municipalityBoundariesLayer = null;
    if (boundariesGroup) {
      var boundaryLayers = boundariesGroup.getLayers ? boundariesGroup.getLayers().getArray() : [];
      boundaryLayers.forEach(function(layer) {
        var title = layer.get('title');
        if (title && title.indexOf('Municipality Boundaries') !== -1) {
          municipalityBoundariesLayer = layer;
        }
      });
      
      if (municipalityBoundariesLayer) {
        console.log('Found Municipality Boundaries layer');
        
        // Turn layer on if any municipalities are selected, off if none
        if (selectedMunicipalities.length > 0) {
          municipalityBoundariesLayer.setVisible(true);
          console.log('Municipality Boundaries layer turned ON, filtering to:', selectedMunicipalities);
          
          // Filter the layer features
          var source = municipalityBoundariesLayer.getSource();
          var features = source.getFeatures();
          console.log('Total Municipality Boundary features:', features.length);
          
          features.forEach(function(feature) {
            var props = feature.getProperties();
            var showFeature = false;
            
            console.log('Municipality Feature MUNICIPAL_NAME:', props.MUNICIPAL_NAME);
            
            // Check if this feature's MUNICIPAL_NAME is in the selected list
            if (props.MUNICIPAL_NAME && selectedMunicipalities.indexOf(props.MUNICIPAL_NAME) !== -1) {
              showFeature = true;
              console.log('  -> Showing this feature');
            }
            
            // Set feature visibility
            feature.setStyle(showFeature ? null : new ol.style.Style({}));
          });
          
          source.changed();
        } else {
          // No filters selected - only hide if not manually toggled on
          // Check current visibility and apply filter-free rendering
          var currentVisibility = municipalityBoundariesLayer.getVisible();
          if (currentVisibility) {
            // Layer is manually on, show all features
            var source = municipalityBoundariesLayer.getSource();
            if (source) {
              source.getFeatures().forEach(function(feature) {
                feature.setStyle(null); // Show all features
              });
              source.changed();
            }
          }
        }
      } else {
        console.log('Municipality Boundaries layer not found!');
      }
    }
  }
  
  // Add event listeners for sliders
  var swScoreSlider = document.getElementById('filter-sw-score');
  var swScoreValue = document.getElementById('sw-score-value');
  swScoreSlider.addEventListener('input', function() {
    swScoreValue.textContent = this.value + '+';
    applyFilters();
  });
  
  var priorityScoreSlider = document.getElementById('filter-priority-score');
  var priorityScoreValue = document.getElementById('priority-score-value');
  priorityScoreSlider.addEventListener('input', function() {
    priorityScoreValue.textContent = this.value + '+';
    applyFilters();
  });
  
  // Add event listeners for dropdown filters (none currently, keeping for future use)
  
  // Add event listeners for all priority subwatershed checkboxes
  var subwatershedCheckboxes = document.querySelectorAll('#filter-priority-subwatershed input[type="checkbox"]');
  subwatershedCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add event listeners for all BMP category checkboxes
  var bmpCategoryCheckboxes = document.querySelectorAll('#filter-bmp-category input[type="checkbox"]');
  bmpCategoryCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add event listeners for all project type checkboxes
  var projectTypeCheckboxes = document.querySelectorAll('#filter-project-type input[type="checkbox"]');
  projectTypeCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add event listener for AND/OR toggle
  var logicToggle = document.getElementById('project-type-logic');
  var logicLabel = document.getElementById('logic-label');
  logicToggle.addEventListener('change', function() {
    if (this.checked) {
      logicLabel.textContent = 'AND';
    } else {
      logicLabel.textContent = 'OR';
    }
    applyFilters();
  });
  
  // Add event listener for Critical Recharge toggle
  var rechargeToggle = document.getElementById('critical-recharge-toggle');
  var rechargeLabel = document.getElementById('recharge-label');
  rechargeToggle.addEventListener('change', function() {
    if (this.checked) {
      rechargeLabel.textContent = 'ON';
    } else {
      rechargeLabel.textContent = 'OFF';
    }
    applyFilters();
  });
  
  // Add event listeners for Conservation Land checkboxes
  var conservationCheckboxes = document.querySelectorAll('#filter-conservation-land input[type="checkbox"]');
  conservationCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add event listeners for Municipality checkboxes
  var municipalityCheckboxes = document.querySelectorAll('#filter-municipality input[type="checkbox"]');
  municipalityCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add collapsible functionality for Priority Subwatershed
  var collapsibleLabel = document.querySelector('.collapsible-label');
  var subwatershedGroup = document.getElementById('filter-priority-subwatershed');
  var collapseIcon = document.querySelector('.collapse-icon');
  
  collapsibleLabel.addEventListener('click', function() {
    subwatershedGroup.classList.toggle('collapsed');
    collapseIcon.classList.toggle('collapsed');
  });
  
  // Add collapsible functionality for BMP Category
  var collapsibleLabelBmp = document.querySelector('.collapsible-label-bmp');
  var bmpCategoryGroup = document.getElementById('filter-bmp-category');
  var collapseIconBmp = document.querySelector('.collapse-icon-bmp');
  
  collapsibleLabelBmp.addEventListener('click', function() {
    bmpCategoryGroup.classList.toggle('collapsed');
    collapseIconBmp.classList.toggle('collapsed');
  });
  
  // Add event listeners for all SRBC focus area checkboxes
  var srbcCheckboxes = document.querySelectorAll('#filter-srbc-focus input[type="checkbox"]');
  srbcCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Add collapsible functionality for SRBC Focus Area
  var collapsibleLabelSrbc = document.querySelector('.collapsible-label-srbc');
  var srbcGroup = document.getElementById('filter-srbc-focus');
  var collapseIconSrbc = document.querySelector('.collapse-icon-srbc');
  
  collapsibleLabelSrbc.addEventListener('click', function() {
    srbcGroup.classList.toggle('collapsed');
    collapseIconSrbc.classList.toggle('collapsed');
  });

  // Add collapsible functionality for Conservation Land
  var collapsibleLabelConservation = document.querySelector('.collapsible-label-conservation');
  var conservationGroup = document.getElementById('filter-conservation-land');
  var collapseIconConservation = document.querySelector('.collapse-icon-conservation');
  
  collapsibleLabelConservation.addEventListener('click', function() {
    conservationGroup.classList.toggle('collapsed');
    collapseIconConservation.classList.toggle('collapsed');
  });

  // Add collapsible functionality for Municipality
  var collapsibleLabelMunicipality = document.querySelector('.collapsible-label-municipality');
  var municipalityGroup = document.getElementById('filter-municipality');
  var collapseIconMunicipality = document.querySelector('.collapse-icon-municipality');
  
  collapsibleLabelMunicipality.addEventListener('click', function() {
    municipalityGroup.classList.toggle('collapsed');
    collapseIconMunicipality.classList.toggle('collapsed');
  });

  // Add mouse wheel scroll support for all checkbox groups
  var checkboxGroups = document.querySelectorAll('.checkbox-group');
  checkboxGroups.forEach(function(group) {
    group.addEventListener('wheel', function(e) {
      // Check if the group has overflow (scrollable content)
      if (this.scrollHeight > this.clientHeight) {
        var atTop = this.scrollTop === 0;
        var atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight;
        
        // Allow scrolling within the group, stop propagation to parent
        e.stopPropagation();
        
        // Prevent default only at scroll boundaries to avoid bounce
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  });

  // Create utility bar toggle control (matching OL control structure)
  var utilityBarToggleContainer = document.createElement('div');
  utilityBarToggleContainer.className = 'ol-unselectable ol-control utility-bar-toggle-control';
  utilityBarToggleContainer.style.position = 'fixed';
  utilityBarToggleContainer.style.left = '8px';
  utilityBarToggleContainer.style.top = '153px';
  utilityBarToggleContainer.style.zIndex = '2100';
  utilityBarToggleContainer.style.background = 'rgba(255,255,255,0.4)';
  utilityBarToggleContainer.style.padding = '2px';
  
  var utilityBarToggle = document.createElement('button');
  utilityBarToggle.className = 'utility-bar-toggle';
  utilityBarToggle.innerHTML = '&#9776;'; // Hamburger icon
  utilityBarToggle.style.width = '40px';
  utilityBarToggle.style.height = '40px';
  utilityBarToggle.style.backgroundColor = '#f8f8f8';
  utilityBarToggle.style.color = '#444444';
  utilityBarToggle.style.border = 'none';
  utilityBarToggle.style.borderRadius = '0px';
  utilityBarToggle.style.fontSize = '20px';
  utilityBarToggle.style.margin = '0';
  utilityBarToggle.style.padding = '0';
  utilityBarToggle.style.cursor = 'pointer';
  utilityBarToggle.style.display = 'block';
  
  utilityBarToggle.onclick = function() {
      utilityBar.classList.remove('collapsed');
      utilityBarToggleContainer.style.display = 'none';
      // Add close button to body (not sidebar) if not present
      if (!document.querySelector('.utility-bar-close')) {
        var utilityBarClose = document.createElement('div');
        utilityBarClose.className = 'utility-bar-close';
        utilityBarClose.innerHTML = '&#9664;'; // Left-pointing arrow
        utilityBarClose.title = 'Close sidebar';
        utilityBarClose.onclick = function() {
          utilityBar.classList.add('collapsed');
          utilityBarToggleContainer.style.display = '';
          utilityBarClose.remove();
        };
        document.body.appendChild(utilityBarClose);
      }
  };
  
  utilityBarToggle.onmouseover = function() {
    utilityBarToggle.style.backgroundColor = 'rgba(248, 248, 248, 0.7)';
  };
  
  utilityBarToggle.onmouseout = function() {
    utilityBarToggle.style.backgroundColor = '#f8f8f8';
  };
  
  utilityBarToggleContainer.appendChild(utilityBarToggle);
  document.body.appendChild(utilityBarToggleContainer);

  // ...existing code for map view, controls, etc. should follow here...
});

var map = new ol.Map({
    target: 'map',
    renderer: 'canvas',
    layers: layersList,
    view: new ol.View({
         maxZoom: 28, minZoom: 1, projection: new ol.proj.Projection({
            code: 'EPSG:3857',
            //extent: [-8509656.459800, 4858735.980300, -8492834.209900, 4888337.389300],
            units: 'm'})
    })
});

//initial view - fit to HUC12 Boundaries layer extent
var huc12Extent = jsonSource_HUC12_Boundaries_6.getExtent();
map.getView().fit(huc12Extent, map.getSize());

//full zooms only
map.getView().setProperties({constrainResolution: true});

////small screen definition
    var hasTouchScreen = map.getViewport().classList.contains('ol-touch');
    var isSmallScreen = window.innerWidth < 650;

////controls container

    //top left container
    var topLeftContainer = new ol.control.Control({
        element: (() => {
            var topLeftContainer = document.createElement('div');
            topLeftContainer.id = 'top-left-container';
            return topLeftContainer;
        })(),
    });
    map.addControl(topLeftContainer)

    //bottom left container
    var bottomLeftContainer = new ol.control.Control({
        element: (() => {
            var bottomLeftContainer = document.createElement('div');
            bottomLeftContainer.id = 'bottom-left-container';
            return bottomLeftContainer;
        })(),
    });
    map.addControl(bottomLeftContainer)
  
    //top right container
    var topRightContainer = new ol.control.Control({
        element: (() => {
            var topRightContainer = document.createElement('div');
            topRightContainer.id = 'top-right-container';
            return topRightContainer;
        })(),
    });
    map.addControl(topRightContainer)

    //bottom right container
    var bottomRightContainer = new ol.control.Control({
        element: (() => {
            var bottomRightContainer = document.createElement('div');
            bottomRightContainer.id = 'bottom-right-container';
            return bottomRightContainer;
        })(),
    });
    map.addControl(bottomRightContainer)

//popup
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var sketch;

function stopMediaInPopup() {
    var mediaElements = container.querySelectorAll('audio, video');
    mediaElements.forEach(function(media) {
        media.pause();
        media.currentTime = 0;
    });
}
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    stopMediaInPopup();
    // Remove highlight when popup is closed
    if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
        highlight = null;
    }
    return false;
};
var overlayPopup = new ol.Overlay({
    element: container,
	autoPan: true
});
map.addOverlay(overlayPopup)
    
    
var NO_POPUP = 0
var ALL_FIELDS = 1

/**
 * Returns either NO_POPUP, ALL_FIELDS or the name of a single field to use for
 * a given layer
 * @param layerList {Array} List of ol.Layer instances
 * @param layer {ol.Layer} Layer to find field info about
 */
function getPopupFields(layerList, layer) {
    // Determine the index that the layer will have in the popupLayers Array,
    // if the layersList contains more items than popupLayers then we need to
    // adjust the index to take into account the base maps group
    var idx = layersList.indexOf(layer) - (layersList.length - popupLayers.length);
    return popupLayers[idx];
}

//highligth collection
var collection = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
        features: collection,
        useSpatialIndex: false // optional, might improve performance
    }),
    style: [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.1)'
        }),
    })],
    updateWhileAnimating: true, // optional, for instant visual feedback
    updateWhileInteracting: true // optional, for instant visual feedback
});

var doHighlight = false;
var doHover = false;

function createPopupField(currentFeature, currentFeatureKeys, layer) {
    var popupText = '';
    
    // First check if there's an image to display at the top
    if (currentFeature.get('image_url')) {
        var imageUrl = currentFeature.get('image_url');
        popupText += '<tr><td colspan="2" style="text-align: center; padding: 10px 0;"><img src="' + 
            imageUrl + '" alt="Site photo" style="max-width: 100%; max-height: 300px; cursor: pointer;" ' +
            'onclick="openLightbox(\'' + imageUrl.replace(/'/g, "\\'") + '\')" ' +
            'title="Click to view full size" /></td></tr>';
    }
    
    // Add bullet point summary section
    var summaryText = '';
    var bmpCategory = currentFeature.get('BMP_Category');
    if (bmpCategory) {
        summaryText += '<tr><td colspan="2" style="padding: 15px; text-align: center; border-bottom: 2px solid #ccc;">' +
            '<div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Summary</div>' +
            '<div style="font-size: 15px; margin-bottom: 10px;">• BMP Category: ' + bmpCategory + '</div>';
        
        // Add Stormwater Priority only if category is stormwater
        if (bmpCategory.toLowerCase() === 'stormwater') {
            var swScore = currentFeature.get('Final_SW_Score');
            if (swScore !== null) {
                summaryText += '<div style="font-size: 15px; margin-bottom: 10px;">• Stormwater Priority: ' + swScore + '</div>';
            }
        }
        
        // Add source information
        var source = currentFeature.get('Source');
        var sourceYear = currentFeature.get('Source_Year');
        if (source || sourceYear) {
            summaryText += '<div style="font-size: 15px; margin-bottom: 10px;">• Original Source: ' + 
                (source || '') + (source && sourceYear ? ', ' : '') + (sourceYear || '') + '</div>';
        }
        
        summaryText += '</td></tr>';
        popupText += summaryText;
    }
    document.addEventListener('DOMContentLoaded', function() {
        var utilityBar = document.createElement('div');
        utilityBar.className = 'utility-bar collapsed';
        utilityBar.innerHTML = `
            <div class="utility-bar-section" id="utility-bar-filters">
                <h3>Filters</h3>
                <div class="filter-group">
                    <label for="filter-priority-subwatershed">Priority Subwatershed:</label>
                    <select id="filter-priority-subwatershed">
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="filter-project-type">Project Type:</label>
                    <select id="filter-project-type">
                        <option value="">All</option>
                        <option value="Stormwater">Stormwater</option>
                        <option value="Buffer">Buffer</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <!-- More sections can be added below -->
        `;
        document.body.appendChild(utilityBar);

        var utilityBarToggle = document.createElement('div');
        utilityBarToggle.className = 'utility-bar-toggle';
        utilityBarToggle.innerHTML = '&#9776;'; // Hamburger icon
        utilityBarToggle.onclick = function() {
            utilityBar.classList.toggle('collapsed');
        };
        document.body.appendChild(utilityBarToggle);
  
        // Link the CSS for the utility bar
        var utilityBarCss = document.createElement('link');
        utilityBarCss.rel = 'stylesheet';
        utilityBarCss.href = 'resources/utility_bar.css';
        document.head.appendChild(utilityBarCss);
    });
    
    // Add remaining fields
    for (var i = 0; i < currentFeatureKeys.length; i++) {
        // Skip certain fields
        if (currentFeatureKeys[i] == 'geometry' || 
            currentFeatureKeys[i] == 'layerObject' || 
            currentFeatureKeys[i] == 'idO' || 
            currentFeatureKeys[i] == 'image_url' ||
            currentFeatureKeys[i] == 'BMP_Category' ||
            currentFeatureKeys[i] == 'Final_SW_Score' ||
            currentFeatureKeys[i] == 'Source' ||
            currentFeatureKeys[i] == 'Source_Year') {
            continue;
        }

        // Skip null or empty values
        var value = currentFeature.get(currentFeatureKeys[i]);
        if (value === null || value === '' || value === ' ') {
            continue;
        }
        
        var popupField = '';
        
        // Skip hidden fields
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "hidden field") {
            continue;
        }
        
        // Handle field labels
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - always visible" ||
            layer.get('fieldLabels')[currentFeatureKeys[i]] == "inline label - visible with data") {
            var fieldName = layer.get('fieldAliases')[currentFeatureKeys[i]] || currentFeatureKeys[i];
            // Replace underscores with spaces and capitalize each word
            fieldName = fieldName.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            popupField += '<th style="font-size: 14px; padding: 4px 8px; text-align: right;">' + 
                fieldName + ':</th>' +
                '<td style="font-size: 14px; padding: 4px 8px;">';
        } else {
            popupField += '<td colspan="2" style="font-size: 14px; padding: 4px 8px;">';
        }

        // Handle header labels
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
            if (currentFeature.get(currentFeatureKeys[i]) == null) {
                continue;
            }
        }
        
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - always visible" ||
            layer.get('fieldLabels')[currentFeatureKeys[i]] == "header label - visible with data") {
            popupField += '<strong>' + layer.get('fieldAliases')[currentFeatureKeys[i]] + '</strong><br />';
        }

        // Handle field values
        if (layer.get('fieldImages')[currentFeatureKeys[i]] != "ExternalResource") {
            if (currentFeature.get(currentFeatureKeys[i]) != null) {
                popupField += '<span style="color: #444;">' + 
                    autolinker.link(currentFeature.get(currentFeatureKeys[i]).toLocaleString()) + 
                    '</span></td>';
            } else {
                popupField += '</td>';
            }
        } else {
            var fieldValue = currentFeature.get(currentFeatureKeys[i]);
            if (fieldValue != null) {
                if (/\.(gif|jpg|jpeg|tif|tiff|png|avif|webp|svg)$/i.test(fieldValue)) {
                    popupField += '<img src="images/' + fieldValue.replace(/[\\\/:]/g, '_').trim() + 
                        '" style="max-width:300px; margin: auto;" /></td>';
                } else if (/\.(mp4|webm|ogg|avi|mov|flv)$/i.test(fieldValue)) {
                    popupField += '<video controls><source src="images/' + 
                        fieldValue.replace(/[\\\/:]/g, '_').trim() + 
                        '" type="video/mp4">Your browser does not support the video tag.</video></td>';
                } else if (/\.(mp3|wav|ogg|aac|flac)$/i.test(fieldValue)) {
                    popupField += '<audio controls><source src="images/' + 
                        fieldValue.replace(/[\\\/:]/g, '_').trim() + 
                        '" type="audio/mpeg">Your browser does not support the audio tag.</audio></td>';
                } else {
                    popupField += '<span style="color: #444;">' + 
                        autolinker.link(fieldValue.toLocaleString()) + '</span></td>';
                }
            } else {
                popupField += '</td>';
            }
        }
        
        // Add the field to the popup text
        if (popupField) {
            popupText += '<tr>' + popupField + '</tr>';
        }
    }
    
    return popupText;
}

var highlight;
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

function onPointerMove(evt) {
    if (!doHover && !doHighlight) {
        return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature;
    var currentLayer;
    var currentFeatureKeys;
    var clusteredFeatures;
    var clusterLength;
    var popupText = '<ul>';

    // Collect all features and their layers at the pixel
    var featuresAndLayers = [];
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined)) {
            featuresAndLayers.push({ feature, layer });
        }
    });

    // Iterate over the features and layers in reverse order
    for (var i = featuresAndLayers.length - 1; i >= 0; i--) {
        var feature = featuresAndLayers[i].feature;
        var layer = featuresAndLayers[i].layer;
        var doPopup = false;
        for (k in layer.get('fieldImages')) {
            if (layer.get('fieldImages')[k] != "Hidden") {
                doPopup = true;
            }
        }
        currentFeature = feature;
        currentLayer = layer;
        clusteredFeatures = feature.get("features");
        if (clusteredFeatures) {
            clusterLength = clusteredFeatures.length;
        }
        if (typeof clusteredFeatures !== "undefined") {
            if (doPopup) {
                for(var n=0; n<clusteredFeatures.length; n++) {
                    currentFeature = clusteredFeatures[n];
                    currentFeatureKeys = currentFeature.getKeys();
                    popupText += '<li><table>'
                    popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                    popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                    popupText += '</table></li>';    
                }
            }
        } else {
            currentFeatureKeys = currentFeature.getKeys();
            if (doPopup) {
                popupText += '<li><table>';
                popupText += '<a>' + '<b>' + layer.get('popuplayertitle') + '</b>' + '</a>';
                popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                popupText += '</table></li>';
            }
        }
    }

    if (popupText == '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }
    
	if (doHighlight) {
        if (currentFeature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (currentFeature) {
                var featureStyle
                if (typeof clusteredFeatures == "undefined") {
					var style = currentLayer.getStyle();
					var styleFunction = typeof style === 'function' ? style : function() { return style; };
					featureStyle = styleFunction(currentFeature)[0];
				} else {
					featureStyle = currentLayer.getStyle().toString();
				}

                if (currentFeature.getGeometry().getType() == 'Point' || currentFeature.getGeometry().getType() == 'MultiPoint') {
                    var radius
					if (typeof clusteredFeatures == "undefined") {
						radius = featureStyle.getImage().getRadius();
					} else {
						radius = parseFloat(featureStyle.split('radius')[1].split(' ')[1]) + clusterLength;
					}

                    highlightStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({
                                color: "rgba(255, 255, 0, 0.5)"
                            }),
                            stroke: new ol.style.Stroke({
                                color: "#ffff00",
                                width: 2
                            }),
                            radius: radius
                        })
                    })
                } else if (currentFeature.getGeometry().getType() == 'LineString' || currentFeature.getGeometry().getType() == 'MultiLineString') {

                    var featureWidth = featureStyle.getStroke().getWidth();

                    highlightStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: '#ffff00',
                            lineDash: null,
                            width: featureWidth
                        })
                    });

                } else {
                    highlightStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 0, 0.5)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff00',
                            width: 2
                        })
                    })
                }
                featureOverlay.getSource().addFeature(currentFeature);
                featureOverlay.setStyle(highlightStyle);
            }
            highlight = currentFeature;
        }
    }

    if (doHover) {
        if (popupText) {
			content.innerHTML = popupText;
            container.style.display = 'block';
            overlayPopup.setPosition(coord);
        } else {
            container.style.display = 'none';
            closer.blur();
        }
    }
};

map.on('pointermove', onPointerMove);

var popupContent = '';
var popupCoord = null;
var featuresPopupActive = false;

function updatePopup() {
    if (popupContent) {
        content.innerHTML = popupContent;
        container.style.display = 'block';
		overlayPopup.setPosition(popupCoord);
    } else {
        container.style.display = 'none';
        closer.blur();
        stopMediaInPopup();
    }
} 

function onSingleClickFeatures(evt) {
    if (doHover || sketch) {
        return;
    }
    if (!featuresPopupActive) {
        featuresPopupActive = true;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var currentFeature;
    var currentFeatureKeys;
    var clusteredFeatures;
    var popupText = '<ul>';
    
    // Clear any existing highlight
    if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
        highlight = null;
    }
    
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer && feature instanceof ol.Feature && (layer.get("interactive") || layer.get("interactive") === undefined)) {
            var doPopup = false;
            for (var k in layer.get('fieldImages')) {
                if (layer.get('fieldImages')[k] !== "Hidden") {
                    doPopup = true;
                }
            }
            currentFeature = feature;
            clusteredFeatures = feature.get("features");
            if (typeof clusteredFeatures !== "undefined") {
                if (doPopup) {
                    for(var n = 0; n < clusteredFeatures.length; n++) {
                        currentFeature = clusteredFeatures[n];
                        currentFeatureKeys = currentFeature.getKeys();
                        popupText += '<li><table>';
                        popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
                        popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                        popupText += '</table></li>';    
                    }
                }
            } else {
                currentFeatureKeys = currentFeature.getKeys();
                if (doPopup) {
                    popupText += '<li><table>';
                    popupText += '<a><b>' + layer.get('popuplayertitle') + '</b></a>';
                    popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                    popupText += '</table>';
                }
            }
            
            // Add highlighting for the clicked feature
            if (currentFeature) {
                var featureStyle;
                if (currentFeature.getGeometry().getType() == 'Point' || currentFeature.getGeometry().getType() == 'MultiPoint') {
                    highlightStyle = new ol.style.Style({
                        image: new ol.style.Circle({
                            fill: new ol.style.Fill({
                                color: "rgba(255, 255, 0, 0.5)"
                            }),
                            stroke: new ol.style.Stroke({
                                color: "#ffff00",
                                width: 2
                            }),
                            radius: 8
                        })
                    });
                } else {
                    highlightStyle = new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 0, 0.3)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffff00',
                            width: 2
                        })
                    });
                }
                featureOverlay.getSource().addFeature(currentFeature);
                featureOverlay.setStyle(highlightStyle);
                highlight = currentFeature;
            }
        }
    });
    if (popupText === '<ul>') {
        popupText = '';
    } else {
        popupText += '</ul>';
    }
	
	popupContent = popupText;
    popupCoord = coord;
    updatePopup();
}

function onSingleClickWMS(evt) {
    if (doHover || sketch) {
        return;
    }
    if (!featuresPopupActive) {
        popupContent = '';
    }
    var coord = evt.coordinate;
    var viewProjection = map.getView().getProjection();
    var viewResolution = map.getView().getResolution();

    for (var i = 0; i < wms_layers.length; i++) {
        if (wms_layers[i][1] && wms_layers[i][0].getVisible()) {
            var url = wms_layers[i][0].getSource().getFeatureInfoUrl(
                evt.coordinate, viewResolution, viewProjection, {
                    'INFO_FORMAT': 'text/html',
                });
            if (url) {
                const wmsTitle = wms_layers[i][0].get('popuplayertitle');
                var ldsRoller = '<div class="roller-switcher" style="height: 25px; width: 25px;"></div>';

                popupCoord = coord;
                popupContent += ldsRoller;
                updatePopup();

                var timeoutPromise = new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(new Error('Timeout exceeded'));
                    }, 5000); // (5 second)
                });

                // Function to try fetch with different option
                function tryFetch(urls) {
                    if (urls.length === 0) {
                        return Promise.reject(new Error('All fetch attempts failed'));
                    }
                    return fetch(urls[0])
                        .then((response) => {
                            if (response.ok) {
                                return response.text();
                            } else {
                                throw new Error('Fetch failed');
                            }
                        })
                        .catch(() => tryFetch(urls.slice(1))); // Try next URL
                }

                // List of URLs to try
                // The first URL is the original, the second is the encoded version, and the third is the proxy
                const urlsToTry = [
                    url,
                    encodeURIComponent(url),
                    'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)
                ];

                Promise.race([tryFetch(urlsToTry), timeoutPromise])
                    .then((html) => {
                        if (html.indexOf('<table') !== -1) {
                            popupContent += '<a><b>' + wmsTitle + '</b></a>';
                            popupContent += html + '<p></p>';
                            updatePopup();
                        }
                    })
                    .finally(() => {
                        setTimeout(() => {
                            var loaderIcon = document.querySelector('.roller-switcher');
                            if (loaderIcon) loaderIcon.remove();
                        }, 500); // (0.5 second)
                    });
            }
        }
    }
}

map.on('singleclick', onSingleClickFeatures);
map.on('singleclick', onSingleClickWMS);

//get container
var topLeftContainerDiv = document.getElementById('top-left-container')
var bottomLeftContainerDiv = document.getElementById('bottom-left-container')
var bottomRightContainerDiv = document.getElementById('bottom-right-container')

//title

//abstract


//geolocate



//measurement
let measuring = false;

	const measureButton = document.createElement('button');
	measureButton.className = 'measure-button fas fa-ruler';
	measureButton.title = 'Measure';

	const measureControl = document.createElement('div');
	measureControl.className = 'ol-unselectable ol-control measure-control';
	measureControl.appendChild(measureButton);
	map.getTargetElement().appendChild(measureControl);

	// Event handler
	function handleMeasure() {
	  if (!measuring) {
		selectLabel.style.display = "";
		map.addInteraction(draw);
		createHelpTooltip();
		createMeasureTooltip();
		measuring = true;
	  } else {
		selectLabel.style.display = "none";
		map.removeInteraction(draw);
		map.removeOverlay(helpTooltip);
		map.removeOverlay(measureTooltip);
		const staticTooltips = document.getElementsByClassName("tooltip-static");
		while (staticTooltips.length > 0) {
		  staticTooltips[0].parentNode.removeChild(staticTooltips[0]);
		}
		measureLayer.getSource().clear();
		sketch = null;
		measuring = false;
	  }
	}

	measureButton.addEventListener('click', handleMeasure);
	measureButton.addEventListener('touchstart', handleMeasure);

    map.on('pointermove', function(evt) {
        if (evt.dragging) {
            return;
        }
        if (measuring) {
            /** @type {string} */
            var helpMsg = 'Click to start drawing';
            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }
            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);
        }
    });
    

    var selectLabel = document.createElement("label");
    selectLabel.innerHTML = "&nbsp;Measure:&nbsp;";

    var typeSelect = document.createElement("select");
    typeSelect.id = "type";

    var measurementOption = [
        { value: "LineString", description: "Length" },
        { value: "Polygon", description: "Area" }
        ];
    measurementOption.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.text = option.description;
        typeSelect.appendChild(optionElement);
    });

    selectLabel.appendChild(typeSelect);
    measureControl.appendChild(selectLabel);

    selectLabel.style.display = "none";
	/**
	 * Currently drawn feature.
	 * @type {ol.Feature}
	 */

	/**
	 * The help tooltip element.
	 * @type {Element}
	 */
	var helpTooltipElement;


	/**
	 * Overlay to show the help messages.
	 * @type {ol.Overlay}
	 */
	var helpTooltip;


	/**
	 * The measure tooltip element.
	 * @type {Element}
	 */
	var measureTooltipElement;


	/**
	 * Overlay to show the measurement.
	 * @type {ol.Overlay}
	 */
	var measureTooltip;


	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	var continueLineMsg = 'Click to continue drawing the line';



	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	var continuePolygonMsg = "1click continue, 2click close";


	var typeSelect = document.getElementById("type");
	var typeSelectForm = document.getElementById("form_measure");

	typeSelect.onchange = function (e) {		  
	  map.removeInteraction(draw);
	  addInteraction();
	  map.addInteraction(draw);		  
	};

	var measureLineStyle = new ol.style.Style({
	  stroke: new ol.style.Stroke({ 
		color: "rgba(0, 0, 255)", //blu
		lineDash: [10, 10],
		width: 4
	  }),
	  image: new ol.style.Circle({
		radius: 6,
		stroke: new ol.style.Stroke({
		  color: "rgba(255, 255, 255)", 
		  width: 1
		}),
	  })
	});

	var measureLineStyle2 = new ol.style.Style({	  
		stroke: new ol.style.Stroke({
			color: "rgba(255, 255, 255)", 
			lineDash: [10, 10],
			width: 2
		  }),
	  image: new ol.style.Circle({
		radius: 5,
		stroke: new ol.style.Stroke({
		  color: "rgba(0, 0, 255)", 
		  width: 1
		}),
			  fill: new ol.style.Fill({
		  color: "rgba(255, 204, 51, 0.4)", 
		}),
		  })
	});

	var labelStyle = new ol.style.Style({
	  text: new ol.style.Text({
		font: "14px Calibri,sans-serif",
		fill: new ol.style.Fill({
		  color: "rgba(0, 0, 0, 1)"
		}),
		stroke: new ol.style.Stroke({
		  color: "rgba(255, 255, 255, 1)",
		  width: 3
		})
	  })
	});

	var labelStyleCache = [];

	var styleFunction = function (feature, type) {
	  var styles = [measureLineStyle, measureLineStyle2];
	  var geometry = feature.getGeometry();
	  var type = geometry.getType();
	  var lineString;
	  if (!type || type === type) {
		if (type === "Polygon") {
		  lineString = new ol.geom.LineString(geometry.getCoordinates()[0]);
		} else if (type === "LineString") {
		  lineString = geometry;
		}
	  }
	  if (lineString) {
		var count = 0;
		lineString.forEachSegment(function (a, b) {
		  var segment = new ol.geom.LineString([a, b]);
		  var label = formatLength(segment);
		  if (labelStyleCache.length - 1 < count) {
			labelStyleCache.push(labelStyle.clone());
		  }
		  labelStyleCache[count].setGeometry(segment);
		  labelStyleCache[count].getText().setText(label);
		  styles.push(labelStyleCache[count]);
		  count++;
		});
	  }
	  return styles;
	};
	var source = new ol.source.Vector();

	var measureLayer = new ol.layer.Vector({
	  source: source,
	  displayInLayerSwitcher: false,
	  style: function (feature) {
		labelStyleCache = [];
		return styleFunction(feature);
	  }
	});

	map.addLayer(measureLayer);

	var draw; // global so we can remove it later
	function addInteraction() {
	  var type = typeSelect.value;
	  draw = new ol.interaction.Draw({
		source: source,
		type: /** @type {ol.geom.GeometryType} */ (type),
		style: function (feature) {
				  return styleFunction(feature, type);
				}
	  });

	  var listener;
	  draw.on('drawstart',
		  function(evt) {
			// set sketch
			sketch = evt.feature;

			/** @type {ol.Coordinate|undefined} */
			var tooltipCoord = evt.coordinate;

			listener = sketch.getGeometry().on('change', function(evt) {
			  var geom = evt.target;
			  var output;
			  if (geom instanceof ol.geom.Polygon) {
					  output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
					  tooltipCoord = geom.getInteriorPoint().getCoordinates();
					} else if (geom instanceof ol.geom.LineString) {
					  output = formatLength(/** @type {ol.geom.LineString} */ (geom));
					  tooltipCoord = geom.getLastCoordinate();
					}
			  measureTooltipElement.innerHTML = output;
			  measureTooltip.setPosition(tooltipCoord);
			});
		  }, this);

	  draw.on('drawend',
		  function(evt) {
			measureTooltipElement.className = 'tooltip tooltip-static';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			measureTooltipElement = null;
			createMeasureTooltip();
			ol.Observable.unByKey(listener);
		  }, this);
	}


	/**
	 * Creates a new help tooltip
	 */
	function createHelpTooltip() {
	  if (helpTooltipElement) {
		helpTooltipElement.parentNode.removeChild(helpTooltipElement);
	  }
	  helpTooltipElement = document.createElement('div');
	  helpTooltipElement.className = 'tooltip hidden';
	  helpTooltip = new ol.Overlay({
		element: helpTooltipElement,
		offset: [15, 0],
		positioning: 'center-left'
	  });
	  map.addOverlay(helpTooltip);
	}


	/**
	 * Creates a new measure tooltip
	 */
	function createMeasureTooltip() {
	  if (measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	  }
	  measureTooltipElement = document.createElement('div');
	  measureTooltipElement.className = 'tooltip tooltip-measure';
	  measureTooltip = new ol.Overlay({
		element: measureTooltipElement,
		offset: [0, -15],
		positioning: 'bottom-center'
	  });
	  map.addOverlay(measureTooltip);
	}


  /**
  * format length output
  * @param {ol.geom.LineString} line
  * @return {string}
  */
  var formatLength = function(line) {
    var length;
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = map.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += ol.sphere.getDistance(c1, c2);
      }
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
          ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
          ' ' + 'm';
    }
    return output;
  };

  /**
  * Format area output.
  * @param {ol.geom.Polygon} polygon The polygon.
  * @return {string} Formatted area.
  */
	var formatArea = function (polygon) {
		var sourceProj = map.getView().getProjection();
		var geom = polygon.clone().transform(sourceProj, 'EPSG:3857');
		var area = Math.abs(ol.sphere.getArea(geom));
		var output;
		if (area > 1000000) {
			output = Math.round((area / 1000000) * 1000) / 1000 + ' ' + 'km<sup>2</sup>';
		} else {
			output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
		}
		return output.replace('.', ',');
	};

  addInteraction();

  var parentElement = document.querySelector(".measure-control");
  var elementToMove = document.getElementById("form_measure");
  if (elementToMove && parentElement) {
    parentElement.insertBefore(elementToMove, parentElement.firstChild);
  }


//geocoder


//layer search


//scalebar


//layerswitcher
var layerSwitcher = new ol.control.LayerSwitcher({
    tipLabel: "Layers",
    reverse: true,
    groupSelectStyle: 'group'
});
map.addControl(layerSwitcher);
    





//attribution
var bottomAttribution = new ol.control.Attribution({
  collapsible: false,
  collapsed: false,
  className: 'bottom-attribution'
});
map.addControl(bottomAttribution);

var attributionList = document.createElement('li');
attributionList.innerHTML = `
	<a href="https://github.com/qgis2web/qgis2web">qgis2web</a> &middot;
	<a href="https://openlayers.org/">OpenLayers</a> &middot;
	<a href="https://qgis.org/">QGIS</a>	
`;
var bottomAttributionUl = bottomAttribution.element.querySelector('ul');
if (bottomAttributionUl) {
  bottomAttribution.element.insertBefore(attributionList, bottomAttributionUl);
}


// Disable "popup on hover" or "highlight on hover" if ol-control mouseover
var preDoHover = doHover;
var preDoHighlight = doHighlight;
var isPopupAllActive = false;
document.addEventListener('DOMContentLoaded', function() {
	if (doHover || doHighlight) {
		var controlElements = document.getElementsByClassName('ol-control');
		for (var i = 0; i < controlElements.length; i++) {
			controlElements[i].addEventListener('mouseover', function() { 
				doHover = false;
				doHighlight = false;
			});
			controlElements[i].addEventListener('mouseout', function() {
				doHover = preDoHover;
				if (isPopupAllActive) { return }
				doHighlight = preDoHighlight;
			});
		}
	}
});


//move controls inside containers, in order
    //zoom
    var zoomControl = document.getElementsByClassName('ol-zoom')[0];
    if (zoomControl) {
        topLeftContainerDiv.appendChild(zoomControl);
    }
    //geolocate
    if (typeof geolocateControl !== 'undefined') {
        topLeftContainerDiv.appendChild(geolocateControl);
    }
    //measure
    if (typeof measureControl !== 'undefined') {
        topLeftContainerDiv.appendChild(measureControl);
    }
    //geocoder
    var searchbar = document.getElementsByClassName('photon-geocoder-autocomplete ol-unselectable ol-control')[0];
    if (searchbar) {
        topLeftContainerDiv.appendChild(searchbar);
    }
    //search layer
    var searchLayerControl = document.getElementsByClassName('search-layer')[0];
    if (searchLayerControl) {
        topLeftContainerDiv.appendChild(searchLayerControl);
    }
    //scale line
    var scaleLineControl = document.getElementsByClassName('ol-scale-line')[0];
    if (scaleLineControl) {
        scaleLineControl.className += ' ol-control';
        bottomLeftContainerDiv.appendChild(scaleLineControl);
    }
    //attribution
    var attributionControl = document.getElementsByClassName('bottom-attribution')[0];
    if (attributionControl) {
        bottomRightContainerDiv.appendChild(attributionControl);
    }