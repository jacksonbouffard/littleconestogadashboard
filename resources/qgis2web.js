
// Function to close splash screen
function closeSplash() {
  // Check if files are loaded (only if the upload system is present)
  var enterBtn = document.getElementById('enter-dashboard-btn');
  if (enterBtn && enterBtn.disabled) {
    // Button is disabled, don't allow closing
    return false;
  }
  
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

// Function to open splash screen
function openSplash() {
  var splashScreen = document.getElementById('splash-screen');
  var mapElement = document.getElementById('map');
  
  if (splashScreen) {
    // Check if files are already loaded in sessionStorage
    const hasStoredFiles = sessionStorage.getItem('bmp_data') && sessionStorage.getItem('parcel_data');
    
    // If files are loaded, hide the upload section and enable the button
    if (hasStoredFiles) {
      const fileUploadSection = document.querySelector('.file-upload-section');
      if (fileUploadSection) {
        fileUploadSection.style.display = 'none';
      }
      const enterBtn = document.getElementById('enter-dashboard-btn');
      if (enterBtn) {
        enterBtn.disabled = false;
      }
      const statusDiv = document.getElementById('file-status');
      if (statusDiv) {
        statusDiv.className = 'file-status success';
        statusDiv.textContent = '✓ Layer data is loaded. Click "Enter Dashboard" to continue.';
        statusDiv.style.display = 'block';
      }
    } else {
      // Show the upload section if files aren't loaded
      const fileUploadSection = document.querySelector('.file-upload-section');
      if (fileUploadSection) {
        fileUploadSection.style.display = 'block';
      }
    }
    
    splashScreen.style.display = 'flex';
    // Remove hidden class to trigger fade-in
    setTimeout(function() {
      splashScreen.classList.remove('hidden');
    }, 10);
    // Add blur to map and controls
    if (mapElement) {
      mapElement.classList.add('blurred');
    }
    // Add body classes to prevent scrolling and blur controls
    document.body.classList.add('no-scroll');
    document.body.classList.add('splash-active');
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
  utilityBar.id = 'utility-bar';
  utilityBar.className = 'utility-bar collapsed';
  utilityBar.innerHTML = `
      <div class="utility-bar-header">
          <button id="clear-all-filters-btn" class="clear-all-filters-btn" title="Reset all filters to default">
              Clear All Filters
          </button>
          <button id="zoom-to-filtered-btn" class="clear-all-filters-btn" title="Zoom map to filtered features" style="background-color: #4CAF50;">
              Zoom to Filtered
          </button>
          <button id="reset-extent-btn" class="clear-all-filters-btn" title="Reset map to default extent">
              Reset Extent
          </button>
      </div>
      <div class="utility-bar-section" id="utility-bar-both-filters">
          <h3>Both (Points & Parcels)</h3>
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
              <div id="and-logic-message" style="display: none; font-size: 11px; color: #666; font-style: italic; margin: 5px 0 8px 0;">
                  Showing parcel projects with all selected types
              </div>
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
      </div>
      
      <div class="utility-bar-section" id="utility-bar-point-filters">
          <h3>Point Filters</h3>
          <div class="filter-group">
              <label style="display: flex; justify-content: space-between; align-items: center;">
                  <span>Has Photos:</span>
                  <span style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <span id="photos-label">OFF</span>
                      <label class="switch">
                          <input type="checkbox" id="photos-toggle">
                          <span class="switch-slider"></span>
                      </label>
                  </span>
              </label>
          </div>
          <div class="filter-group">
              <label class="collapsible-label-bmp" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>BMP Category:</span> <span class="collapse-icon-bmp">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-bmp-category">
                  <label><input type="checkbox" value="Stormwater"> Stormwater</label>
                  <label><input type="checkbox" value="Agricultural"> Agricultural</label>
                  <div style="font-size: 11px; font-style: italic; color: #666; margin-top: 5px; padding-left: 5px;">
                      SWR, BI, PP & BSR are considered stormwater BMPs
                  </div>
              </div>
          </div>
          <div class="filter-group">
              <label class="collapsible-label-implementation" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <span>Implementation Status:</span> <span class="collapse-icon-implementation">▼</span>
              </label>
              <div class="checkbox-group collapsed" id="filter-implementation-status">
                  <label><input type="checkbox" value="Potential"> Potential</label>
                  <label><input type="checkbox" value="Implemented"> Implemented</label>
                  <label><input type="checkbox" value="Planned"> Planned</label>
              </div>
          </div>
          <div class="filter-group">
              <label for="filter-sw-score">
                  Stormwater Priority Score:
                  <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRY9YPQ0GDHTRN8IbKcIVHMEzaPalyrNyUDTMQpR0o_6n02TydW6x8n8YcXXOkps0No2TwEb2sKYMy3/pubhtml" target="_blank" rel="noopener noreferrer" 
                     style="margin-left: 5px; font-size: 10px; padding: 2px 6px; background-color: #5a9fd4; color: white; 
                            text-decoration: none; border-radius: 3px; display: inline-block; vertical-align: middle;"
                     title="View methodology documentation">
                      Methodology
                  </a>
              </label>
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
              <label for="filter-priority-score">
                  Priority Score:
                  <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTCMRM2yMYCPlefSIVGLyBK582neo6SEZ4So0dKcFO60cxAp_LcLiBVy6avM-DGnruxd5lnFhV4rN2Z/pubhtml" target="_blank" rel="noopener noreferrer" 
                     style="margin-left: 5px; font-size: 10px; padding: 2px 6px; background-color: #5a9fd4; color: white; 
                            text-decoration: none; border-radius: 3px; display: inline-block; vertical-align: middle;"
                     title="View methodology documentation">
                      Methodology
                  </a>
              </label>
              <div class="slider-container">
                  <input type="range" id="filter-priority-score" min="0" max="60" value="0" step="1">
                  <div class="slider-values">
                      <span id="priority-score-min">0</span>
                      <span id="priority-score-value">0+</span>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="utility-bar-section" id="utility-bar-boundary-labels">
          <h3>Boundary Labels</h3>
          <div class="filter-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: start;">
              <label class="checkbox-label" style="white-space: nowrap;">
                  <input type="checkbox" id="label-municipality">
                  <span>Municipalities</span>
              </label>
              <label class="checkbox-label" style="white-space: nowrap;">
                  <input type="checkbox" id="label-delisting">
                  <span>Delisting</span>
              </label>
              <label class="checkbox-label" style="white-space: nowrap;">
                  <input type="checkbox" id="label-huc12">
                  <span>HUC12s</span>
              </label>
              <label class="checkbox-label" style="white-space: nowrap;">
                  <input type="checkbox" id="label-srbc">
                  <span>SRBC Zones</span>
              </label>
              <label class="checkbox-label" style="white-space: nowrap;">
                  <input type="checkbox" id="label-smallsheds">
                  <span>Smallsheds</span>
              </label>
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
    
    // Get photos filter state (false = Off/0, true = On/1)
    var photosOn = document.getElementById('photos-toggle').checked;
    
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
    
    // Get selected implementation statuses from checkboxes
    var selectedImplementationStatuses = [];
    var implementationStatusCheckboxes = document.querySelectorAll('#filter-implementation-status input[type="checkbox"]:checked');
    implementationStatusCheckboxes.forEach(function(checkbox) {
      selectedImplementationStatuses.push(checkbox.value);
    });
    
    // Get selected project types from checkboxes
    var selectedProjectTypes = [];
    var checkboxes = document.querySelectorAll('#filter-project-type input[type="checkbox"]:checked');
    checkboxes.forEach(function(checkbox) {
      selectedProjectTypes.push(checkbox.value);
    });
    
    // Get AND/OR logic (false = OR, true = AND)
    var useAndLogic = document.getElementById('project-type-logic').checked;
    
    // When AND logic is used, hide points layer as AND logic only applies to parcel projects
    var shouldHidePoints = useAndLogic && selectedProjectTypes.length > 0;
    
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
      
      // If AND logic is enabled with project types selected, hide all points
      if (shouldHidePoints) {
        console.log('Hiding all points because AND logic is enabled');
        pointFeatures.forEach(function(feature) {
          feature.setStyle(new ol.style.Style({}));
        });
      } else {
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
        
        // Filter by Implementation Status (if any are selected)
        if (selectedImplementationStatuses.length > 0) {
          var implemented = props.Implemented;
          var status = 'Potential'; // default
          
          if (implemented === 'yes') {
            status = 'Implemented';
          } else if (implemented === 'planned') {
            status = 'Planned';
          }
          
          if (selectedImplementationStatuses.indexOf(status) === -1) {
            show = false;
          }
        }
        
        // Filter by In_Critical_Recharge (if toggle is on, only show features with value = 1)
        if (criticalRechargeOn) {
          if (props.In_Critical_Recharge !== 1 && props.In_Critical_Recharge !== 1.0) {
            show = false;
          }
        }
        
        // Filter by image_binary (if toggle is on, only show features with photos = 1)
        if (photosOn) {
          if (props.image_binary !== 1 && props.image_binary !== 1.0) {
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
      }
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
          // Store that filter activated the layer
          municipalityBoundariesLayer.set('filterActivated', true);
          municipalityBoundariesLayer.setVisible(true);
          console.log('Municipality Boundaries layer turned ON by filter, filtering to:', selectedMunicipalities);
          
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
          // No filters selected
          console.log('No municipality filters active');
          
          // If the layer was activated by filter, turn it off now
          var wasFilterActivated = municipalityBoundariesLayer.get('filterActivated');
          if (wasFilterActivated) {
            console.log('Turning off municipality layer (was activated by filter)');
            municipalityBoundariesLayer.setVisible(false);
            municipalityBoundariesLayer.set('filterActivated', false);
          }
          
          // Show all features (in case layer is manually turned on)
          var source = municipalityBoundariesLayer.getSource();
          if (source) {
            source.getFeatures().forEach(function(feature) {
              feature.setStyle(null); // Show all features
            });
            source.changed();
          }
        }
      } else {
        console.log('Municipality Boundaries layer not found!');
      }
    }
    
    // Update feature counter after filters are applied
    if (typeof window.updateFeatureCounts === 'function') {
      setTimeout(window.updateFeatureCounts, 100);
    }
    
    // Auto-zoom disabled for now - causes basemap tile issues
    // Zoom to filtered features (with longer delay to ensure styles are updated)
    // setTimeout(function() {
    //   zoomToFilteredFeatures();
    // }, 300);
    
    // Update clear filters button state
    console.log('About to call updateClearFiltersButtonState');
    if (typeof updateClearFiltersButtonState === 'function') {
      updateClearFiltersButtonState();
    } else {
      console.log('updateClearFiltersButtonState is not defined yet');
    }
  }
  
  // Function to check if any filters are active
  function updateClearFiltersButtonState() {
    console.log('=== updateClearFiltersButtonState called ===');
    var clearBtn = document.getElementById('clear-all-filters-btn');
    if (!clearBtn) {
      console.log('Clear button not found');
      return;
    }
    console.log('Clear button found:', clearBtn);
    
    var filtersActive = false;
    
    // Check sliders
    var swSlider = document.getElementById('filter-sw-score');
    var prioritySlider = document.getElementById('filter-priority-score');
    if (swSlider && prioritySlider) {
      var swScore = parseFloat(swSlider.value);
      var priorityScore = parseFloat(prioritySlider.value);
      if (swScore > 0 || priorityScore > 0) {
        filtersActive = true;
        console.log('Filters active: sliders', swScore, priorityScore);
      }
    }
    
    // Check toggles
    var rechargeToggle = document.getElementById('critical-recharge-toggle');
    var photosToggle = document.getElementById('photos-toggle');
    if (rechargeToggle && photosToggle) {
      if (rechargeToggle.checked || photosToggle.checked) {
        filtersActive = true;
        console.log('Filters active: toggles');
      }
    }
    
    // Check if any conservation land is selected (default is none, so any selection = filter active)
    var conservationCheckboxes = document.querySelectorAll('#filter-conservation-land input[type="checkbox"]');
    if (conservationCheckboxes.length > 0) {
      var conservationChecked = Array.from(conservationCheckboxes).filter(cb => cb.checked).length;
      if (conservationChecked > 0) {
        filtersActive = true;
        console.log('Filters active: conservation land');
      }
    }
    
    // Check if any municipalities are selected (default is none, so any selection = filter active)
    var municipalityCheckboxes = document.querySelectorAll('#filter-municipality input[type="checkbox"]');
    console.log('Municipality checkboxes found:', municipalityCheckboxes.length);
    if (municipalityCheckboxes.length > 0) {
      var municipalityChecked = Array.from(municipalityCheckboxes).filter(cb => cb.checked).length;
      console.log('Municipality checked:', municipalityChecked);
      if (municipalityChecked > 0) {
        filtersActive = true;
        console.log('Filters active: municipalities');
      }
    }
    
    // Check if any priority subwatersheds are selected (default is none, so any selection = filter active)
    var subwatershedCheckboxes = document.querySelectorAll('#filter-priority-subwatershed input[type="checkbox"]');
    if (subwatershedCheckboxes.length > 0) {
      var subwatershedChecked = Array.from(subwatershedCheckboxes).filter(cb => cb.checked).length;
      if (subwatershedChecked > 0) {
        filtersActive = true;
        console.log('Filters active: subwatersheds');
      }
    }
    
    // Check if any implementation statuses are selected (default is none, so any selection = filter active)
    var implementationCheckboxes = document.querySelectorAll('#filter-implementation-status input[type="checkbox"]');
    if (implementationCheckboxes.length > 0) {
      var implementationChecked = Array.from(implementationCheckboxes).filter(cb => cb.checked).length;
      if (implementationChecked > 0) {
        filtersActive = true;
        console.log('Filters active: implementation');
      }
    }
    
    // Check if any SRBC areas are selected (default is none, so any selection = filter active)
    var srbcCheckboxes = document.querySelectorAll('#filter-srbc-focus input[type="checkbox"]');
    if (srbcCheckboxes.length > 0) {
      var srbcChecked = Array.from(srbcCheckboxes).filter(cb => cb.checked).length;
      if (srbcChecked > 0) {
        filtersActive = true;
        console.log('Filters active: SRBC');
      }
    }
    
    // Check if any project types are selected (default is none, so any selection = filter active)
    var projectTypeCheckboxes = document.querySelectorAll('#filter-project-type input[type="checkbox"]');
    if (projectTypeCheckboxes.length > 0) {
      var projectTypeChecked = Array.from(projectTypeCheckboxes).filter(cb => cb.checked).length;
      if (projectTypeChecked > 0) {
        filtersActive = true;
        console.log('Filters active: project type');
      }
    }
    
    // Check if any BMP categories are selected (default is none, so any selection = filter active)
    var bmpCategoryCheckboxes = document.querySelectorAll('#filter-bmp-category input[type="checkbox"]');
    if (bmpCategoryCheckboxes.length > 0) {
      var bmpCategoryChecked = Array.from(bmpCategoryCheckboxes).filter(cb => cb.checked).length;
      if (bmpCategoryChecked > 0) {
        filtersActive = true;
        console.log('Filters active: BMP category');
      }
    }
    
    // Update button state
    console.log('Filters active:', filtersActive);
    if (filtersActive) {
      clearBtn.classList.remove('disabled');
      clearBtn.disabled = false;
      console.log('Button enabled');
    } else {
      clearBtn.classList.add('disabled');
      clearBtn.disabled = true;
      console.log('Button disabled');
    }
  }
  
  // Function to zoom to the extent of filtered features
  function zoomToFilteredFeatures() {
    console.log('=== zoomToFilteredFeatures called ===');
    
    // Use the global map instance
    var actualMap = window.globalMap;
    
    if (!actualMap) {
      console.error('Global map not found!');
      return;
    }
    
    console.log('Using global map:', actualMap);
    
    var extent = ol.extent.createEmpty();
    var hasVisibleFeatures = false;
    var visibleCount = 0;
    var hiddenCount = 0;
    
    // Get the layers from the same location as applyFilters does
    var layersList = actualMap.getLayers().getArray();
    console.log('layersList length:', layersList.length);
    var featuresGroup = layersList[2];
    console.log('featuresGroup:', featuresGroup);
    var bmpLayer = null;
    var parcelLayer = null;
    
    if (featuresGroup) {
      var layers = featuresGroup.getLayers ? featuresGroup.getLayers().getArray() : [];
      console.log('layers in group:', layers.length);
      layers.forEach(function(layer) {
        var title = layer.get('title');
        console.log('Checking layer with title:', title);
        if (title && title.startsWith('BMP Survey Points')) {
          bmpLayer = layer;
          console.log('Found BMP layer');
        } else if (title && title.startsWith('Parcel Level Projects')) {
          parcelLayer = layer;
          console.log('Found Parcel layer');
        }
      });
    }
    
    if (bmpLayer) {
      console.log('BMP layer found, getting source');
      var bmpSource = bmpLayer.getSource();
      console.log('BMP source:', bmpSource);
      if (bmpSource) {
        var features = bmpSource.getFeatures();
        console.log('Total BMP features:', features.length);
        features.forEach(function(feature) {
          var style = feature.getStyle();
          // Feature is visible if style is null (default style) or undefined
          // Feature is hidden if style is an empty ol.style.Style({})
          if (style === null || style === undefined) {
            var geom = feature.getGeometry();
            if (geom) {
              var featureExtent = geom.getExtent();
              console.log('Adding BMP feature extent:', featureExtent);
              ol.extent.extend(extent, featureExtent);
              hasVisibleFeatures = true;
              visibleCount++;
            }
          } else {
            hiddenCount++;
          }
        });
        console.log('BMP - Visible:', visibleCount, 'Hidden:', hiddenCount);
      }
    } else {
      console.log('BMP layer not found');
    }
    
    if (parcelLayer) {
      console.log('Parcel layer found, getting source');
      var parcelSource = parcelLayer.getSource();
      console.log('Parcel source:', parcelSource);
      if (parcelSource) {
        var parcelVisibleCount = 0;
        var parcelHiddenCount = 0;
        var features = parcelSource.getFeatures();
        console.log('Total Parcel features:', features.length);
        features.forEach(function(feature) {
          var style = feature.getStyle();
          // Feature is visible if style is null (default style) or undefined
          // Feature is hidden if style is an empty ol.style.Style({})
          if (style === null || style === undefined) {
            var geom = feature.getGeometry();
            if (geom) {
              var featureExtent = geom.getExtent();
              ol.extent.extend(extent, featureExtent);
              hasVisibleFeatures = true;
              visibleCount++;
              parcelVisibleCount++;
            }
          } else {
            hiddenCount++;
            parcelHiddenCount++;
          }
        });
        console.log('Parcel - Visible:', parcelVisibleCount, 'Hidden:', parcelHiddenCount);
        console.log('Total visible:', visibleCount, 'Total hidden:', hiddenCount);
      }
    } else {
      console.log('Parcel layer not found');
    }
    
    console.log('Final extent:', extent);
    console.log('hasVisibleFeatures:', hasVisibleFeatures);
    console.log('extent isEmpty:', ol.extent.isEmpty(extent));
    
    // If we have visible features, zoom to their extent with padding
    if (hasVisibleFeatures && !ol.extent.isEmpty(extent)) {
      // Validate extent is reasonable
      var extentWidth = ol.extent.getWidth(extent);
      var extentHeight = ol.extent.getHeight(extent);
      console.log('Extent dimensions:', extentWidth, 'x', extentHeight);
      
      if (extentWidth > 0 && extentHeight > 0) {
        console.log('Attempting to zoom to extent');
        
        // Calculate target zoom and center
        var view = actualMap.getView();
        var currentZoomRaw = view.getZoom();
        console.log('Raw current zoom:', currentZoomRaw);
        
        // Handle case where getZoom returns undefined or NaN
        var currentZoom = currentZoomRaw;
        if (isNaN(currentZoom) || currentZoom === undefined) {
          console.log('Current zoom is NaN or undefined, using resolution to calculate');
          var currentResolution = view.getResolution();
          console.log('Current resolution:', currentResolution);
          currentZoom = view.getZoomForResolution(currentResolution);
          console.log('Calculated current zoom from resolution:', currentZoom);
        }
        currentZoom = Math.round(currentZoom);
        
        var center = ol.extent.getCenter(extent);
        
        // Calculate target zoom level
        var mapSize = actualMap.getSize();
        var resolution = view.getResolutionForExtent(extent, mapSize);
        var targetZoom = Math.round(view.getZoomForResolution(resolution) - 0.5);
        targetZoom = Math.max(10, Math.min(17, targetZoom));
        
        console.log('Current zoom:', currentZoom, 'Target zoom:', targetZoom, 'Center:', center);
        
        // If no zoom needed, just pan to center
        if (Math.abs(targetZoom - currentZoom) < 0.5) {
          console.log('Already at target zoom level, just centering');
          view.animate({
            center: center,
            duration: 600,
            easing: ol.easing.easeInOut
          });
          return;
        }
        
        // Single smooth animation directly to target zoom and center
        // This is smoother than stepping through each zoom level
        view.animate({
          center: center,
          zoom: targetZoom,
          duration: 1500, // Longer duration for smooth zoom
          easing: ol.easing.easeInOut // Smooth acceleration and deceleration
        });
        
        console.log('Starting smooth zoom animation to', visibleCount, 'filtered features');
      } else {
        console.log('Invalid extent dimensions');
      }
    } else {
      console.log('No visible features to zoom to. hasVisibleFeatures:', hasVisibleFeatures, 'isEmpty:', ol.extent.isEmpty(extent));
    }
  }
  
  // Function to reset map to default extent
  function resetMapExtent() {
    var activeMap = window.globalMap;
    if (!activeMap) {
      console.error('Global map not found for reset extent');
      return;
    }
    
    // Get the HUC12 boundaries layer extent (the default initial view)
    var huc12Extent = jsonSource_HUC12_Boundaries_6.getExtent();
    
    // Animate back to the default extent
    activeMap.getView().fit(huc12Extent, {
      size: activeMap.getSize(),
      duration: 1500, // Match the zoom animation duration
      easing: ol.easing.easeInOut
    });
    
    console.log('Resetting map to default extent');
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
  
  // Add event listeners for all implementation status checkboxes
  var implementationStatusCheckboxes = document.querySelectorAll('#filter-implementation-status input[type="checkbox"]');
  implementationStatusCheckboxes.forEach(function(checkbox) {
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
  var andLogicMessage = document.getElementById('and-logic-message');
  
  logicToggle.addEventListener('change', function() {
    if (this.checked) {
      logicLabel.textContent = 'AND';
      andLogicMessage.style.display = 'block';
    } else {
      logicLabel.textContent = 'OR';
      andLogicMessage.style.display = 'none';
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
  
  // Add event listener for Photos toggle
  var photosToggle = document.getElementById('photos-toggle');
  var photosLabel = document.getElementById('photos-label');
  photosToggle.addEventListener('change', function() {
    if (this.checked) {
      photosLabel.textContent = 'ON';
    } else {
      photosLabel.textContent = 'OFF';
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
    checkbox.addEventListener('change', function() {
      applyFilters();
      // Update municipality labels if they're enabled
      var labelCheckbox = document.getElementById('label-municipality');
      if (labelCheckbox && labelCheckbox.checked) {
        updateBoundaryLabels('municipality', true);
      }
    });
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
  
  // Add collapsible functionality for Implementation Status
  var collapsibleLabelImplementation = document.querySelector('.collapsible-label-implementation');
  var implementationGroup = document.getElementById('filter-implementation-status');
  var collapseIconImplementation = document.querySelector('.collapse-icon-implementation');
  
  collapsibleLabelImplementation.addEventListener('click', function() {
    implementationGroup.classList.toggle('collapsed');
    collapseIconImplementation.classList.toggle('collapsed');
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
  
  // Clear All Filters button event listener
  var clearFiltersBtn = document.getElementById('clear-all-filters-btn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
      console.log('Clear All Filters button clicked');
      
      // Reset sliders to minimum values
      var swSlider = document.getElementById('filter-sw-score');
      var prioritySlider = document.getElementById('filter-priority-score');
      if (swSlider) {
        swSlider.value = 0;
        var swValue = document.getElementById('slider-value-sw');
        if (swValue) swValue.textContent = '0';
      }
      if (prioritySlider) {
        prioritySlider.value = 0;
        var priorityValue = document.getElementById('slider-value-priority');
        if (priorityValue) priorityValue.textContent = '0';
      }
      
      // Turn off toggles
      var rechargeToggle = document.getElementById('critical-recharge-toggle');
      var photosToggle = document.getElementById('photos-toggle');
      if (rechargeToggle) {
        rechargeToggle.checked = false;
        var rechargeLabel = document.getElementById('recharge-label');
        if (rechargeLabel) rechargeLabel.textContent = 'OFF';
      }
      if (photosToggle) {
        photosToggle.checked = false;
        var photosLabel = document.getElementById('photos-label');
        if (photosLabel) photosLabel.textContent = 'OFF';
      }
      
      // Uncheck all conservation land checkboxes (default = none checked)
      var conservationCheckboxes = document.querySelectorAll('#filter-conservation-land input[type="checkbox"]');
      conservationCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all municipality checkboxes (default = none checked, shows all)
      var municipalityCheckboxes = document.querySelectorAll('#filter-municipality input[type="checkbox"]');
      municipalityCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all priority subwatershed checkboxes (default = none checked, shows all)
      var subwatershedCheckboxes = document.querySelectorAll('#filter-priority-subwatershed input[type="checkbox"]');
      subwatershedCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all implementation status checkboxes (default = none checked, shows all)
      var implementationCheckboxes = document.querySelectorAll('#filter-implementation-status input[type="checkbox"]');
      implementationCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all SRBC focus area checkboxes (default = none checked, shows all)
      var srbcCheckboxes = document.querySelectorAll('#filter-srbc-focus input[type="checkbox"]');
      srbcCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all project type checkboxes (default = none checked, shows all)
      var projectTypeCheckboxes = document.querySelectorAll('#filter-project-type input[type="checkbox"]');
      projectTypeCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Uncheck all BMP category checkboxes (default = none checked, shows all)
      var bmpCategoryCheckboxes = document.querySelectorAll('#filter-bmp-category input[type="checkbox"]');
      bmpCategoryCheckboxes.forEach(function(checkbox) {
        checkbox.checked = false;
      });
      
      // Reapply filters to show all features
      console.log('Calling applyFilters after clearing');
      applyFilters();
    });
    
    // Initialize button state
    setTimeout(function() {
      updateClearFiltersButtonState();
    }, 500);
  }
  
  // Add zoom to filtered button event listener
  var zoomToFilteredBtn = document.getElementById('zoom-to-filtered-btn');
  if (zoomToFilteredBtn) {
    zoomToFilteredBtn.addEventListener('click', function() {
      console.log('Zoom to filtered button clicked');
      zoomToFilteredFeatures();
    });
  }
  
  // Add reset extent button event listener
  var resetExtentBtn = document.getElementById('reset-extent-btn');
  if (resetExtentBtn) {
    resetExtentBtn.addEventListener('click', function() {
      console.log('Reset extent button clicked');
      resetMapExtent();
    });
  }

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

  // Boundary Labels Configuration
  var boundaryLabelConfig = {
    'municipality': {
      layerMatch: 'Municipality Boundaries',
      field: 'MUNICIPAL_NAME',
      layer: null,
      labelLayer: null
    },
    'huc12': {
      layerMatch: 'HUC12 Boundaries',
      field: 'name',
      layer: null,
      labelLayer: null
    },
    'delisting': {
      layerMatch: 'Delisting Catchments',
      field: 'NAME',
      layer: null,
      labelLayer: null
    },
    'srbc': {
      layerMatch: 'SRBC Focus Areas',
      field: 'FocusArea',
      layer: null,
      labelLayer: null
    },
    'smallsheds': {
      layerMatch: 'Smallsheds',
      field: 'NAME',
      layer: null,
      labelLayer: null
    }
  };

  // Find and store references to boundary layers
  function initBoundaryLayers() {
    window.globalMap.getLayers().forEach(function(layer) {
      if (layer instanceof ol.layer.Group) {
        layer.getLayers().forEach(function(subLayer) {
          var title = subLayer.get('title');
          if (!title) return;
          
          // Check each config entry
          for (var key in boundaryLabelConfig) {
            var config = boundaryLabelConfig[key];
            if (title.indexOf(config.layerMatch) !== -1) {
              config.layer = subLayer;
            }
          }
        });
      }
    });
    
    // Create dedicated label layers for each boundary type (these will render on top)
    for (var key in boundaryLabelConfig) {
      var config = boundaryLabelConfig[key];
      if (config.layer) {
        var labelLayer = new ol.layer.Vector({
          source: new ol.source.Vector(),
          style: function(feature) {
            var labelText = feature.get('labelText');
            return new ol.style.Style({
              text: new ol.style.Text({
                text: labelText,
                font: 'bold 14px Arial,sans-serif',
                fill: new ol.style.Fill({
                  color: '#000'
                }),
                stroke: new ol.style.Stroke({
                  color: '#fff',
                  width: 4
                }),
                overflow: true
              })
            });
          },
          zIndex: 1000
        });
        config.labelLayer = labelLayer;
        window.globalMap.addLayer(labelLayer);
        
        // Add visibility listener to base layer
        (function(configKey, baseLayer, labelLyr) {
          baseLayer.on('change:visible', function() {
            var isVisible = baseLayer.getVisible();
            var checkboxId = 'label-' + configKey;
            var checkbox = document.getElementById(checkboxId);
            
            // If base layer is hidden, hide the label layer (but keep checkbox state)
            // If base layer is shown and checkbox is checked, show the label layer
            if (!isVisible) {
              labelLyr.setVisible(false);
            } else if (checkbox && checkbox.checked) {
              labelLyr.setVisible(true);
            }
          });
        })(key, config.layer, labelLayer);
      }
    }
  }

  // Initialize boundary layers
  setTimeout(function() {
    initBoundaryLayers();
  }, 500);

  // Function to update boundary labels
  function updateBoundaryLabels(configKey, enabled) {
    var config = boundaryLabelConfig[configKey];
    if (!config || !config.layer || !config.labelLayer) return;
    
    var targetLayer = config.layer;
    var labelLayer = config.labelLayer;
    var labelSource = labelLayer.getSource();
    
    if (enabled) {
      // If the base layer is off, turn it on
      if (!targetLayer.getVisible()) {
        targetLayer.setVisible(true);
      }
      
      // Clear any existing labels
      labelSource.clear();
      
      console.log('Creating labels for:', configKey);
      
      // Get active municipality filters if this is the municipality layer
      var activeMunicipalityFilter = [];
      if (configKey === 'municipality') {
        var municipalityCheckboxes = document.querySelectorAll('#filter-municipality input[type="checkbox"]:checked');
        municipalityCheckboxes.forEach(function(checkbox) {
          activeMunicipalityFilter.push(checkbox.value);
        });
        if (activeMunicipalityFilter.length > 0) {
          console.log('Filtering municipality labels to:', activeMunicipalityFilter);
        }
      }
      
      // Track unique labels to avoid duplicates - group by label text
      var labelGroups = {};
      
      // Get features from the base layer and group by label text
      var features = targetLayer.getSource().getFeatures();
      console.log('Total features found:', features.length);
      
      features.forEach(function(feature) {
        var labelText = feature.get(config.field);
        if (labelText) {
          // If municipality filter is active, only include filtered municipalities
          if (configKey === 'municipality' && activeMunicipalityFilter.length > 0) {
            if (activeMunicipalityFilter.indexOf(labelText) === -1) {
              return; // Skip this feature
            }
          }
          
          if (!labelGroups[labelText]) {
            labelGroups[labelText] = [];
          }
          labelGroups[labelText].push(feature);
        }
      });
      
      console.log('Unique label groups:', Object.keys(labelGroups).length);
      console.log('Label groups:', Object.keys(labelGroups));
      
      // For each unique label, find the largest geometry (main polygon) to place the label
      for (var labelText in labelGroups) {
        var groupFeatures = labelGroups[labelText];
        console.log('Label "' + labelText + '" has', groupFeatures.length, 'features');
        
        // Find the feature with the largest area/extent
        var largestFeature = groupFeatures[0];
        var largestArea = 0;
        
        groupFeatures.forEach(function(feature) {
          var geom = feature.getGeometry();
          var extent = geom.getExtent();
          var area = (extent[2] - extent[0]) * (extent[3] - extent[1]);
          if (area > largestArea) {
            largestArea = area;
            largestFeature = feature;
          }
        });
        
        console.log('Using largest feature for "' + labelText + '", area:', largestArea);
        
        // Use the largest feature's geometry - but use CENTROID to avoid duplicate labels on MultiPolygon
        var geom = largestFeature.getGeometry();
        
        // Get the centroid/center of the geometry to place a single label
        var extent = geom.getExtent();
        var centerX = (extent[0] + extent[2]) / 2;
        var centerY = (extent[1] + extent[3]) / 2;
        var centerPoint = new ol.geom.Point([centerX, centerY]);
        
        // Add line breaks for long labels (split at ~20 characters, looking for spaces)
        var wrappedText = labelText;
        if (labelText.length > 20) {
          var words = labelText.split(' ');
          var lines = [];
          var currentLine = '';
          
          words.forEach(function(word) {
            if ((currentLine + ' ' + word).length <= 20) {
              currentLine = currentLine ? currentLine + ' ' + word : word;
            } else {
              if (currentLine) lines.push(currentLine);
              currentLine = word;
            }
          });
          if (currentLine) lines.push(currentLine);
          
          wrappedText = lines.join('\n');
        }
        
        var labelFeature = new ol.Feature({
          geometry: centerPoint,
          labelText: wrappedText
        });
        labelSource.addFeature(labelFeature);
      }
      
      console.log('Total labels added:', labelSource.getFeatures().length);
      
      // Show the label layer (base layer is now guaranteed to be visible)
      labelLayer.setVisible(true);
    } else {
      // Hide the label layer only (don't touch base layer)
      labelLayer.setVisible(false);
      labelSource.clear();
    }
  }

  // Add event listeners for boundary label checkboxes
  document.getElementById('label-municipality').addEventListener('change', function() {
    updateBoundaryLabels('municipality', this.checked);
  });

  document.getElementById('label-delisting').addEventListener('change', function() {
    updateBoundaryLabels('delisting', this.checked);
  });

  document.getElementById('label-huc12').addEventListener('change', function() {
    updateBoundaryLabels('huc12', this.checked);
  });

  document.getElementById('label-srbc').addEventListener('change', function() {
    updateBoundaryLabels('srbc', this.checked);
  });

  document.getElementById('label-smallsheds').addEventListener('change', function() {
    updateBoundaryLabels('smallsheds', this.checked);
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
  utilityBarToggleContainer.style.top = '100px'; // Position below zoom controls with equal gap
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
      
      // Move feature counter when sidebar opens
      var featureCounter = document.getElementById('feature-counter');
      if (featureCounter) {
          featureCounter.classList.add('sidebar-open');
          console.log('Sidebar opened, feature counter moved right');
      }
      
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
          
          // Move feature counter back when sidebar closes
          var featureCounter = document.getElementById('feature-counter');
          if (featureCounter) {
              featureCounter.classList.remove('sidebar-open');
              console.log('Sidebar closed, feature counter moved left');
          }
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

// Make map globally accessible
window.globalMap = map;

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
  
    // Create splash screen button (info/help button)
    var splashButtonContainer = document.createElement('div');
    splashButtonContainer.className = 'ol-unselectable ol-control splash-button-control';
    
    var splashButton = document.createElement('button');
    splashButton.className = 'splash-reopen-button';
    splashButton.innerHTML = '&#9432;'; // Info icon (ⓘ)
    splashButton.title = 'Show Information';
    splashButton.onclick = function() {
        openSplash();
    };
    
    splashButtonContainer.appendChild(splashButton);
    document.getElementById('bottom-left-container').appendChild(splashButtonContainer);

    // Create feature counter box
    var featureCounter = document.createElement('div');
    featureCounter.id = 'feature-counter';
    featureCounter.innerHTML = '<div class="counter-content">' +
        '<div class="counter-title">Feature Counter</div>' +
        '<div id="bmp-counter" class="counter-row"></div>' +
        '<div id="parcel-counter" class="counter-row"></div>' +
        '<div class="counter-download-section">' +
        '<button id="download-filtered-btn" class="counter-download-btn" title="Download filtered features">⬇ Download Filtered Content</button>' +
        '</div>' +
        '</div>';
    document.body.appendChild(featureCounter);
    
    // Create download modal
    var downloadModal = document.createElement('div');
    downloadModal.id = 'download-modal';
    downloadModal.className = 'download-modal hidden';
    downloadModal.innerHTML = '<div class="download-modal-content">' +
        '<div class="download-modal-header">' +
        '<h3>Download Filtered Content</h3>' +
        '<button id="download-modal-close" class="download-modal-close">×</button>' +
        '</div>' +
        '<div class="download-modal-body">' +
        '<label>Include Layers:</label>' +
        '<div class="download-layer-checkboxes">' +
        '<label class="download-checkbox-label">' +
        '<input type="checkbox" id="include-bmp" class="download-layer-checkbox" checked>' +
        '<span>BMP Survey Points</span>' +
        '</label>' +
        '<label class="download-checkbox-label">' +
        '<input type="checkbox" id="include-parcel" class="download-layer-checkbox" checked>' +
        '<span>Parcel Level Projects</span>' +
        '</label>' +
        '</div>' +
        '<label for="download-filename" style="margin-top: 15px;">File Name:</label>' +
        '<input type="text" id="download-filename" class="download-filename-input" value="little_conestoga_filtered_data_' + new Date().toISOString().slice(0,10) + '">' +
        '<label for="download-format" style="margin-top: 15px;">Format:</label>' +
        '<select id="download-format" class="download-format-select">' +
        '<option value="excel">Excel Spreadsheet (.xlsx)</option>' +
        '<option value="csv">CSV - Comma Separated Values</option>' +
        '<option value="geojson">GeoJSON - Geographic JSON</option>' +
        '</select>' +
        '<div class="download-help-section" style="margin-top: 20px; padding: 12px; background-color: #f0f0f0; border-radius: 4px; font-size: 13px;">' +
        '<strong>Importing Data to ArcGIS Pro:</strong>' +
        '<ul style="margin: 8px 0 0 20px; padding: 0;">' +
        '<li><a href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/conversion/excel-to-table.htm" target="_blank" style="color: #0078d4; text-decoration: none;">Excel to Table</a></li>' +
        '<li><a href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/conversion/json-to-features.htm" target="_blank" style="color: #0078d4; text-decoration: none;">JSON to Features</a></li>' +
        '<li><a href="https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/xy-table-to-point.htm" target="_blank" style="color: #0078d4; text-decoration: none;">XY Table to Point</a></li>' +
        '</ul>' +
        '</div>' +
        '<div class="download-modal-footer">' +
        '<button id="download-cancel-btn" class="download-modal-btn download-cancel-btn">Cancel</button>' +
        '<button id="download-confirm-btn" class="download-modal-btn download-confirm-btn">Download</button>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.body.appendChild(downloadModal);
    
    // Add download button event listener
    document.getElementById('download-filtered-btn').addEventListener('click', function() {
        openDownloadModal();
    });
    
    // Modal event listeners
    document.getElementById('download-modal-close').addEventListener('click', function() {
        closeDownloadModal();
    });
    
    document.getElementById('download-cancel-btn').addEventListener('click', function() {
        closeDownloadModal();
    });
    
    document.getElementById('download-confirm-btn').addEventListener('click', function() {
        var filename = document.getElementById('download-filename').value.trim();
        var format = document.getElementById('download-format').value;
        var includeBMP = document.getElementById('include-bmp').checked;
        var includeParcel = document.getElementById('include-parcel').checked;
        
        if (!filename) {
            alert('Please enter a file name.');
            return;
        }
        
        if (!includeBMP && !includeParcel) {
            alert('Please select at least one layer to export.');
            return;
        }
        
        closeDownloadModal();
        downloadFilteredData(format, filename, includeBMP, includeParcel);
    });
    
    // Close modal when clicking outside
    downloadModal.addEventListener('click', function(e) {
        if (e.target === downloadModal) {
            closeDownloadModal();
        }
    });
    
    // Function to open download modal
    function openDownloadModal() {
        // Update default filename with current date
        var defaultFilename = 'little_conestoga_filtered_data_' + new Date().toISOString().slice(0,10);
        document.getElementById('download-filename').value = defaultFilename;
        
        // Check which layers are currently visible and have features
        var bmpLayer = null;
        var parcelLayer = null;
        
        map.getLayers().forEach(function(layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function(subLayer) {
                    var title = subLayer.get('title');
                    if (title) {
                        if (title.indexOf('BMP Survey Points') === 0) {
                            bmpLayer = subLayer;
                        } else if (title.indexOf('Parcel Level Projects') === 0) {
                            parcelLayer = subLayer;
                        }
                    }
                });
            }
        });
        
        // Set checkbox states based on layer visibility and feature availability
        var bmpCheckbox = document.getElementById('include-bmp');
        var parcelCheckbox = document.getElementById('include-parcel');
        
        var bmpHasVisibleFeatures = false;
        var parcelHasVisibleFeatures = false;
        
        if (bmpLayer && bmpLayer.getVisible()) {
            var bmpFeatures = bmpLayer.getSource().getFeatures();
            bmpHasVisibleFeatures = bmpFeatures.some(function(feature) {
                var style = feature.getStyle();
                return style === null || style === undefined;
            });
        }
        
        if (parcelLayer && parcelLayer.getVisible()) {
            var parcelFeatures = parcelLayer.getSource().getFeatures();
            parcelHasVisibleFeatures = parcelFeatures.some(function(feature) {
                var style = feature.getStyle();
                return style === null || style === undefined;
            });
        }
        
        // Enable/disable and check/uncheck based on availability
        bmpCheckbox.checked = bmpHasVisibleFeatures;
        bmpCheckbox.disabled = !bmpHasVisibleFeatures;
        
        parcelCheckbox.checked = parcelHasVisibleFeatures;
        parcelCheckbox.disabled = !parcelHasVisibleFeatures;
        
        document.getElementById('download-modal').classList.remove('hidden');
    }
    
    // Function to close download modal
    function closeDownloadModal() {
        document.getElementById('download-modal').classList.add('hidden');
    }

    // Function to update feature counts - make it global so applyFilters can call it
    window.updateFeatureCounts = function() {
        console.log('updateFeatureCounts called');
        
        // Get BMP points layer
        var bmpLayer = null;
        var parcelLayer = null;
        
        // Check if map exists
        if (!map) {
            console.log('Map not ready yet');
            return;
        }
        
        console.log('Map layers count:', map.getLayers().getLength());
        
        map.getLayers().forEach(function(layer) {
            console.log('Checking layer type:', layer.constructor.name, 'Title:', layer.get('title'));
            
            if (layer instanceof ol.layer.Group) {
                console.log('Found group:', layer.get('title'), 'with', layer.getLayers().getLength(), 'layers');
                layer.getLayers().forEach(function(subLayer) {
                    var title = subLayer.get('title');
                    console.log('  - Found layer:', title);
                    // Check if title starts with or includes the layer name (since titles have HTML)
                    if (title && title.indexOf('BMP Survey Points') === 0) {
                        bmpLayer = subLayer;
                        console.log('Found BMP layer!');
                    } else if (title && title.indexOf('Parcel Level Projects') === 0) {
                        parcelLayer = subLayer;
                        console.log('Found Parcel layer!');
                    }
                });
            } else {
                // Maybe the layers are not in a group?
                var title = layer.get('title');
                if (title && title.indexOf('BMP Survey Points') === 0) {
                    bmpLayer = layer;
                    console.log('Found BMP layer directly!');
                } else if (title && title.indexOf('Parcel Level Projects') === 0) {
                    parcelLayer = layer;
                    console.log('Found Parcel layer directly!');
                }
            }
        });

        // Track if either layer is visible
        var anyLayerVisible = false;
        var bmpCounterDiv = document.getElementById('bmp-counter');
        var parcelCounterDiv = document.getElementById('parcel-counter');
        var featureCounter = document.getElementById('feature-counter');

        // Update BMP counter
        if (bmpLayer) {
            var bmpLayerVisible = bmpLayer.getVisible();
            
            if (bmpLayerVisible) {
                var bmpSource = bmpLayer.getSource();
                var bmpFeatures = bmpSource.getFeatures();
                var bmpTotal = bmpFeatures.length;
                var bmpVisible = bmpFeatures.filter(function(feature) {
                    // Features with null style are visible, features with empty style are hidden
                    var style = feature.getStyle();
                    return style === null || style === undefined;
                }).length;
                var bmpPercent = bmpTotal > 0 ? ((bmpVisible / bmpTotal) * 100).toFixed(1) : '0.0';
                bmpCounterDiv.innerHTML = '<strong>BMP Points:</strong> ' + bmpVisible + '/' + bmpTotal + ' (' + bmpPercent + '%)';
                bmpCounterDiv.style.display = '';
                anyLayerVisible = true;
                console.log('BMP counter updated:', bmpVisible, '/', bmpTotal);
            } else {
                bmpCounterDiv.style.display = 'none';
                console.log('BMP layer is turned off');
            }
        } else {
            console.log('BMP layer not found');
            bmpCounterDiv.style.display = 'none';
        }

        // Update Parcel counter
        if (parcelLayer) {
            var parcelLayerVisible = parcelLayer.getVisible();
            
            if (parcelLayerVisible) {
                var parcelSource = parcelLayer.getSource();
                var parcelFeatures = parcelSource.getFeatures();
                var parcelTotal = parcelFeatures.length;
                var parcelVisible = parcelFeatures.filter(function(feature) {
                    // Features with null style are visible, features with empty style are hidden
                    var style = feature.getStyle();
                    return style === null || style === undefined;
                }).length;
                var parcelPercent = parcelTotal > 0 ? ((parcelVisible / parcelTotal) * 100).toFixed(1) : '0.0';
                parcelCounterDiv.innerHTML = '<strong>Parcel Projects:</strong> ' + parcelVisible + '/' + parcelTotal + ' (' + parcelPercent + '%)';
                parcelCounterDiv.style.display = '';
                anyLayerVisible = true;
                console.log('Parcel counter updated:', parcelVisible, '/', parcelTotal);
            } else {
                parcelCounterDiv.style.display = 'none';
                console.log('Parcel layer is turned off');
            }
        } else {
            console.log('Parcel layer not found');
            parcelCounterDiv.style.display = 'none';
        }
        
        // Hide entire counter box if both layers are off
        if (featureCounter) {
            if (anyLayerVisible) {
                featureCounter.style.display = 'block';
            } else {
                featureCounter.style.display = 'none';
                console.log('Both layers off, hiding feature counter');
            }
        }
    };
    
    // Function to download filtered data
    window.downloadFilteredData = function(format, filename, includeBMP, includeParcel) {
        // Find the BMP and Parcel layers
        var bmpLayer = null;
        var parcelLayer = null;
        
        map.getLayers().forEach(function(layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function(subLayer) {
                    var title = subLayer.get('title');
                    if (title) {
                        if (title.indexOf('BMP Survey Points') === 0) {
                            bmpLayer = subLayer;
                        } else if (title.indexOf('Parcel Level Projects') === 0) {
                            parcelLayer = subLayer;
                        }
                    }
                });
            }
        });
        
        // Collect visible features from selected layers
        var visibleFeatures = [];
        
        if (includeBMP && bmpLayer && bmpLayer.getVisible()) {
            var bmpSource = bmpLayer.getSource();
            var bmpFeatures = bmpSource.getFeatures();
            bmpFeatures.forEach(function(feature) {
                var style = feature.getStyle();
                if (style === null || style === undefined) {
                    visibleFeatures.push({
                        feature: feature,
                        layerType: 'BMP Survey Points'
                    });
                }
            });
        }
        
        if (includeParcel && parcelLayer && parcelLayer.getVisible()) {
            var parcelSource = parcelLayer.getSource();
            var parcelFeatures = parcelSource.getFeatures();
            parcelFeatures.forEach(function(feature) {
                var style = feature.getStyle();
                if (style === null || style === undefined) {
                    visibleFeatures.push({
                        feature: feature,
                        layerType: 'Parcel Level Projects'
                    });
                }
            });
        }
        
        if (visibleFeatures.length === 0) {
            alert('No visible features to export from the selected layers. Please enable layers and ensure features are not filtered out.');
            return;
        }
        
        if (format === 'excel') {
            downloadAsExcel(visibleFeatures, filename);
        } else if (format === 'csv') {
            downloadAsCSV(visibleFeatures, filename);
        } else if (format === 'geojson') {
            downloadAsGeoJSON(visibleFeatures, filename);
        }
    };
    
    // Function to export as Excel
    function downloadAsExcel(visibleFeatures, filename) {
        if (typeof XLSX === 'undefined') {
            console.warn('XLSX library not available. Falling back to CSV export.');
            alert('Excel export requires the SheetJS library. Downloading as CSV instead.');
            downloadAsCSV(visibleFeatures, filename);
            return;
        }
        
        // Group features by layer type
        var featuresByLayer = {};
        visibleFeatures.forEach(function(item) {
            var layerType = item.layerType;
            if (!featuresByLayer[layerType]) {
                featuresByLayer[layerType] = [];
            }
            featuresByLayer[layerType].push(item);
        });
        
        // Create workbook
        var wb = XLSX.utils.book_new();
        
        // Create a sheet for each layer type
        Object.keys(featuresByLayer).forEach(function(layerType) {
            var layerFeatures = featuresByLayer[layerType];
            
            // Collect all unique field names for this layer
            var allFields = {};
            layerFeatures.forEach(function(item) {
                var props = item.feature.getProperties();
                for (var key in props) {
                    if (key !== 'geometry' && key !== 'layerObject' && key !== 'idO') {
                        allFields[key] = true;
                    }
                }
            });
            
            // Add X/Y coordinates at the beginning (no Layer_Type since it's one per sheet)
            var fieldNames = ['X', 'Y'].concat(Object.keys(allFields).sort());
            
            // Create array of arrays for Excel
            var data = [];
            
            // Add header row
            data.push(fieldNames);
            
            // Add data rows
            layerFeatures.forEach(function(item) {
                var props = item.feature.getProperties();
                var geom = item.feature.getGeometry();
                var coords = null;
                
                // Get coordinates and reproject to WGS84
                if (geom) {
                    var geomType = geom.getType();
                    if (geomType === 'Point') {
                        coords = geom.getCoordinates();
                    } else if (geomType === 'MultiPoint') {
                        coords = geom.getCoordinates()[0];
                    } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
                        coords = geomType === 'LineString' ? geom.getCoordinates()[0] : geom.getCoordinates()[0][0];
                    } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
                        var extent = geom.getExtent();
                        coords = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
                    }
                    
                    // Reproject to WGS84 (EPSG:4326)
                    if (coords) {
                        coords = ol.proj.transform(coords, map.getView().getProjection(), 'EPSG:4326');
                    }
                }
                
                var row = fieldNames.map(function(field) {
                    if (field === 'X') {
                        return coords ? coords[0].toFixed(6) : '';
                    } else if (field === 'Y') {
                        return coords ? coords[1].toFixed(6) : '';
                    } else {
                        var value = props[field];
                        return (value === null || value === undefined) ? '' : value;
                    }
                });
                data.push(row);
            });
            
            // Create worksheet
            var ws = XLSX.utils.aoa_to_sheet(data);
            
            // Auto-size columns
            var colWidths = fieldNames.map(function(field) {
                var maxLength = field.length;
                layerFeatures.forEach(function(item) {
                    var props = item.feature.getProperties();
                    var value;
                    if (field === 'X' || field === 'Y') {
                        value = '000.000000';
                    } else {
                        value = props[field];
                    }
                    if (value !== null && value !== undefined) {
                        var valueLength = String(value).length;
                        if (valueLength > maxLength) {
                            maxLength = valueLength;
                        }
                    }
                });
                return { wch: Math.min(maxLength + 2, 50) };
            });
            ws['!cols'] = colWidths;
            
            // Use appropriate sheet name
            var sheetName = layerType === 'BMP Survey Points' ? 'BMP_Points' : 'Parcel_Projects';
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });
        
        // Generate Excel file and trigger download
        try {
            XLSX.writeFile(wb, filename + '.xlsx');
        } catch (error) {
            console.error('Error creating Excel file:', error);
            alert('Error creating Excel file. Downloading as CSV instead.');
            downloadAsCSV(visibleFeatures, filename);
        }
    }
    
    // Function to export as CSV
    function downloadAsCSV(visibleFeatures, filename) {
        // Group features by layer type
        var featuresByLayer = {};
        visibleFeatures.forEach(function(item) {
            var layerType = item.layerType;
            if (!featuresByLayer[layerType]) {
                featuresByLayer[layerType] = [];
            }
            featuresByLayer[layerType].push(item);
        });
        
        // Create a CSV for each layer type
        Object.keys(featuresByLayer).forEach(function(layerType) {
            var layerFeatures = featuresByLayer[layerType];
            
            // Collect all unique field names for this layer
            var allFields = {};
            layerFeatures.forEach(function(item) {
                var props = item.feature.getProperties();
                for (var key in props) {
                    if (key !== 'geometry' && key !== 'layerObject' && key !== 'idO') {
                        allFields[key] = true;
                    }
                }
            });
            
            // Add X/Y coordinates at the beginning (no Layer_Type since it's one per file)
            var fieldNames = ['X', 'Y'].concat(Object.keys(allFields).sort());
            
            // Create CSV header
            var csv = fieldNames.map(function(field) {
                return '"' + field + '"';
            }).join(',') + '\n';
            
            // Add data rows
            layerFeatures.forEach(function(item) {
                var props = item.feature.getProperties();
                var geom = item.feature.getGeometry();
                var coords = null;
                
                // Get coordinates and reproject to WGS84
                if (geom) {
                    var geomType = geom.getType();
                    if (geomType === 'Point') {
                        coords = geom.getCoordinates();
                    } else if (geomType === 'MultiPoint') {
                        coords = geom.getCoordinates()[0];
                    } else if (geomType === 'LineString' || geomType === 'MultiLineString') {
                        coords = geomType === 'LineString' ? geom.getCoordinates()[0] : geom.getCoordinates()[0][0];
                    } else if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
                        var extent = geom.getExtent();
                        coords = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
                    }
                    
                    // Reproject to WGS84 (EPSG:4326)
                    if (coords) {
                        coords = ol.proj.transform(coords, map.getView().getProjection(), 'EPSG:4326');
                    }
                }
                
                var row = fieldNames.map(function(field) {
                    var value;
                    if (field === 'X') {
                        value = coords ? coords[0].toFixed(6) : '';
                    } else if (field === 'Y') {
                        value = coords ? coords[1].toFixed(6) : '';
                    } else {
                        value = props[field];
                    }
                    
                    // Handle null/undefined
                    if (value === null || value === undefined) {
                        return '""';
                    }
                    
                    // Convert to string and escape quotes
                    value = String(value).replace(/"/g, '""');
                    return '"' + value + '"';
                });
                csv += row.join(',') + '\n';
            });
            
            // Create download with appropriate suffix
            var suffix = layerType === 'BMP Survey Points' ? '_points' : '_parcels';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename + suffix + '.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    // Function to export as GeoJSON
    function downloadAsGeoJSON(visibleFeatures, filename) {
        // Group features by layer type
        var featuresByLayer = {};
        visibleFeatures.forEach(function(item) {
            var layerType = item.layerType;
            if (!featuresByLayer[layerType]) {
                featuresByLayer[layerType] = [];
            }
            featuresByLayer[layerType].push(item);
        });
        
        var format = new ol.format.GeoJSON();
        
        // Create a GeoJSON for each layer type
        Object.keys(featuresByLayer).forEach(function(layerType) {
            var layerFeatures = featuresByLayer[layerType];
            
            var geojson = {
                type: 'FeatureCollection',
                features: []
            };
            
            layerFeatures.forEach(function(item) {
                // Get the feature geometry
                var geom = item.feature.getGeometry();
                
                // Get properties (no Layer_Type since it's one per file)
                var props = {};
                var originalProps = item.feature.getProperties();
                for (var key in originalProps) {
                    if (key !== 'geometry' && key !== 'layerObject' && key !== 'idO') {
                        props[key] = originalProps[key];
                    }
                }
                
                // Convert OpenLayers feature to GeoJSON
                var olFeature = new ol.Feature({
                    geometry: geom
                });
                olFeature.setProperties(props);
                
                var geoJsonFeature = format.writeFeatureObject(olFeature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: map.getView().getProjection()
                });
                
                geojson.features.push(geoJsonFeature);
            });
            
            // Create download with appropriate suffix
            var suffix = layerType === 'BMP Survey Points' ? '_points' : '_parcels';
            var jsonString = JSON.stringify(geojson, null, 2);
            var blob = new Blob([jsonString], { type: 'application/json' });
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename + suffix + '.geojson');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    
    // Function to export as ESRI Shapefile (zipped)
    
    // Set up listeners for layer visibility changes
    // This will be called after layers are loaded to attach visibility listeners
    setTimeout(function() {
        map.getLayers().forEach(function(layer) {
            if (layer instanceof ol.layer.Group) {
                layer.getLayers().forEach(function(subLayer) {
                    var title = subLayer.get('title');
                    if (title && (title.indexOf('BMP Survey Points') === 0 || title.indexOf('Parcel Level Projects') === 0)) {
                        // Listen for visibility changes
                        subLayer.on('change:visible', function() {
                            console.log('Layer visibility changed:', title, 'now', subLayer.getVisible());
                            window.updateFeatureCounts();
                        });
                        console.log('Added visibility listener to:', title);
                    }
                });
            }
        });
    }, 2000);

    // Update counts on initial load - wait for map to render
    map.once('rendercomplete', function() {
        console.log('Map render complete, updating feature counts');
        setTimeout(window.updateFeatureCounts, 500);
    });
    
    // Fallback - also try after a delay in case the event doesn't fire
    setTimeout(window.updateFeatureCounts, 3000);

  
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
    // Remove all highlights when popup is closed
    featureOverlay.getSource().clear();
    highlight = null;
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
        popupText += '<tr><td colspan="2" style="text-align: center; padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><img src="' + 
            imageUrl + '" alt="Site photo" style="max-width: 100%; max-height: 300px; cursor: pointer; border-radius: 4px;" ' +
            'onclick="openLightbox(\'' + imageUrl.replace(/'/g, "\\'") + '\')" ' +
            'title="Click to view full size" /></td></tr>';
    }
    
    // Add bullet point summary section
    var summaryText = '';
    var bmpCategory = currentFeature.get('BMP_Category');
    if (bmpCategory) {
        summaryText += '<tr><td colspan="2" style="padding: 15px; text-align: center; border-bottom: 2px solid #ccc; background-color: #f9f9f9;">' +
            '<div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">Summary</div>' +
            '<div style="font-size: 15px; margin-bottom: 8px;">• <strong>BMP Category:</strong> ' + bmpCategory + '</div>';
        
        // Add Stormwater Priority only if category is stormwater
        if (bmpCategory.toLowerCase() === 'stormwater') {
            var swScore = currentFeature.get('Final_SW_Score');
            if (swScore !== null && swScore !== '' && swScore !== undefined) {
                summaryText += '<div style="font-size: 15px; margin-bottom: 8px;">• <strong>Stormwater Priority:</strong> ' + swScore + '</div>';
            }
        }
        
        // Add Critical Recharge Zone message if In_Critical_Recharge = 1
        var inCriticalRecharge = currentFeature.get('In_Critical_Recharge');
        if (inCriticalRecharge === 1 || inCriticalRecharge === 1.0) {
            summaryText += '<div style="font-size: 15px; margin-bottom: 8px; color: #d32f2f; font-weight: bold;">⚠ In Critical Recharge Zone</div>';
        }
        
        // Add source information
        var source = currentFeature.get('Source');
        var sourceYear = currentFeature.get('Source_Year');
        if (source || sourceYear) {
            summaryText += '<div style="font-size: 15px; margin-bottom: 8px;">• <strong>Original Source:</strong> ' + 
                (source || '') + (source && sourceYear ? ', ' : '') + (sourceYear || '') + '</div>';
        }
        
        summaryText += '</td></tr>';
        popupText += summaryText;
    }
    
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
            currentFeatureKeys[i] == 'Source_Year' ||
            currentFeatureKeys[i] == 'In_Critical_Recharge' ||
            currentFeatureKeys[i] == 'globalID_text') {
            continue;
        }

        // Skip null, empty, or whitespace-only values
        var value = currentFeature.get(currentFeatureKeys[i]);
        if (value === null || value === '' || value === ' ' || value === undefined || 
            (typeof value === 'string' && value.trim() === '')) {
            continue;
        }
        
        // Skip hidden fields
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "hidden field") {
            continue;
        }
        
        // Skip if no label is configured
        if (layer.get('fieldLabels')[currentFeatureKeys[i]] == "no label") {
            continue;
        }
        
        // Get the field name (label)
        var fieldName = layer.get('fieldAliases')[currentFeatureKeys[i]] || currentFeatureKeys[i];
        // Replace underscores with spaces and clean up field name
        fieldName = fieldName.replace(/_/g, ' ').replace(/\([^)]*\)/g, '').trim();
        // Capitalize properly, but preserve common acronyms
        fieldName = fieldName.replace(/\w\S*/g, function(txt) {
            // List of acronyms that should stay uppercase
            var acronyms = ['SRBC', 'HUC12', 'HUC', 'IBI', 'BMP', 'ID', 'PM', 'GW', 'CSC', 'NT', 'RB', 'SR', 'FR', 'CC', 'WR', 'SWP', 'LC', 'SW', 'WAP'];
            var upperTxt = txt.toUpperCase();
            if (acronyms.indexOf(upperTxt) !== -1) {
                return upperTxt;
            }
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        
        var popupField = '';
        
        // All fields get the same two-column format with label and value
        popupField += '<tr style="border-bottom: 1px solid #f0f0f0;">' +
            '<td style="font-size: 13px; padding: 8px; text-align: left; vertical-align: top; ' +
            'background-color: #f7f7f7; color: #555; font-weight: 600; white-space: nowrap; width: 40%;">' + 
            fieldName + ':</td>' +
            '<td style="font-size: 13px; padding: 8px; text-align: left; color: #333; word-wrap: break-word; width: 60%;">';

        // Handle field values
        if (layer.get('fieldImages')[currentFeatureKeys[i]] != "ExternalResource") {
            if (value != null && value !== '') {
                // Format numbers nicely
                var displayValue = value;
                if (typeof value === 'number') {
                    displayValue = value.toLocaleString();
                }
                popupField += '<span>' + autolinker.link(displayValue.toString()) + '</span></td></tr>';
            } else {
                popupField = ''; // Don't add empty rows
            }
        } else {
            if (value != null && value !== '') {
                if (/\.(gif|jpg|jpeg|tif|tiff|png|avif|webp|svg)$/i.test(value)) {
                    popupField += '<img src="images/' + value.replace(/[\\\/:]/g, '_').trim() + 
                        '" style="max-width: 100%; margin: 5px auto; display: block; border-radius: 4px;" /></td></tr>';
                } else if (/\.(mp4|webm|ogg|avi|mov|flv)$/i.test(value)) {
                    popupField += '<video controls style="max-width: 100%;"><source src="images/' + 
                        value.replace(/[\\\/:]/g, '_').trim() + 
                        '" type="video/mp4">Your browser does not support the video tag.</video></td></tr>';
                } else if (/\.(mp3|wav|ogg|aac|flac)$/i.test(value)) {
                    popupField += '<audio controls style="width: 100%;"><source src="images/' + 
                        value.replace(/[\\\/:]/g, '_').trim() + 
                        '" type="audio/mpeg">Your browser does not support the audio tag.</audio></td></tr>';
                } else {
                    popupField += '<span>' + autolinker.link(value.toString()) + '</span></td></tr>';
                }
            } else {
                popupField = ''; // Don't add empty rows
            }
        }
        
        // Add the field to the popup text only if it has content
        if (popupField) {
            popupText += popupField;
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
                var allStyles = null;
                var resolution = map.getView().getResolution();
                if (typeof clusteredFeatures == "undefined") {
					var style = currentLayer.getStyle();
					var styleFunction = typeof style === 'function' ? style : function() { return style; };
					allStyles = styleFunction(currentFeature, resolution);
					featureStyle = allStyles[0];
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

                    // Check if this is a multi-style point (has halo)
                    if (allStyles && allStyles.length > 1) {
                        // Create highlight styles for all point styles (halo + main)
                        highlightStyle = function(feature) {
                            var styles = [];
                            for (var i = 0; i < allStyles.length; i++) {
                                var originalStyle = allStyles[i];
                                if (originalStyle.getImage()) {
                                    var originalRadius = originalStyle.getImage().getRadius();
                                    styles.push(new ol.style.Style({
                                        image: new ol.style.Circle({
                                            fill: new ol.style.Fill({
                                                color: "rgba(255, 255, 0, 0.5)"
                                            }),
                                            stroke: new ol.style.Stroke({
                                                color: "#ffff00",
                                                width: 2
                                            }),
                                            radius: originalRadius
                                        })
                                    }));
                                }
                            }
                            return styles;
                        };
                    } else {
                        // Single style point (no halo)
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
                    }
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
        // Reset scroll position to top when opening new popup
        content.scrollTop = 0;
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
    var featuresToHighlight = []; // Track all features to highlight with their layers
    
    // Clear any existing highlights
    if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
        highlight = null;
    }
    // Clear all features from overlay to prevent ghost highlights
    featureOverlay.getSource().clear();
    
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
                        popupText += '<li class="feature-item">';
                        popupText += '<div class="feature-title">' + layer.get('popuplayertitle') + '</div>';
                        popupText += '<table>';
                        popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                        popupText += '</table></li>';
                        // Collect features with their layers for highlighting
                        featuresToHighlight.push({feature: currentFeature, layer: layer});
                    }
                }
            } else {
                currentFeatureKeys = currentFeature.getKeys();
                if (doPopup) {
                    popupText += '<li class="feature-item">';
                    popupText += '<div class="feature-title">' + layer.get('popuplayertitle') + '</div>';
                    popupText += '<table>';
                    popupText += createPopupField(currentFeature, currentFeatureKeys, layer);
                    popupText += '</table>';
                    // Collect feature with layer for highlighting
                    featuresToHighlight.push({feature: currentFeature, layer: layer});
                }
            }
        }
    });
    
    // Now add highlighting for all collected features after the loop
    if (featuresToHighlight.length > 0) {
        var resolution = map.getView().getResolution();
        
        // Create a style function that handles all features
        var overlayStyleFunction = function(feature) {
            // Find the matching feature info from our collection
            for (var i = 0; i < featuresToHighlight.length; i++) {
                if (featuresToHighlight[i].feature === feature) {
                    var featureLayer = featuresToHighlight[i].layer;
                    
                    if (feature.getGeometry().getType() == 'Point' || feature.getGeometry().getType() == 'MultiPoint') {
                        // Get all styles from the layer's style function
                        var style = featureLayer.getStyle();
                        var styleFunction = typeof style === 'function' ? style : function() { return style; };
                        var allStyles = styleFunction(feature, resolution);
                        
                        // Check if this is a multi-style point (has halo)
                        if (allStyles && allStyles.length > 1) {
                            // Create highlight styles for all point styles (halo + main)
                            var styles = [];
                            for (var j = 0; j < allStyles.length; j++) {
                                var originalStyle = allStyles[j];
                                if (originalStyle.getImage()) {
                                    var originalRadius = originalStyle.getImage().getRadius();
                                    styles.push(new ol.style.Style({
                                        image: new ol.style.Circle({
                                            fill: new ol.style.Fill({
                                                color: "rgba(255, 255, 0, 0.5)"
                                            }),
                                            stroke: new ol.style.Stroke({
                                                color: "#ffff00",
                                                width: 2
                                            }),
                                            radius: originalRadius
                                        })
                                    }));
                                }
                            }
                            return styles;
                        } else {
                            // Single style point (no halo)
                            return [new ol.style.Style({
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
                            })];
                        }
                    } else {
                        return [new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 0, 0.3)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#ffff00',
                                width: 2
                            })
                        })];
                    }
                }
            }
            return [];
        };
        
        // Add all features to the overlay and set the style function once
        for (var i = 0; i < featuresToHighlight.length; i++) {
            featureOverlay.getSource().addFeature(featuresToHighlight[i].feature);
        }
        featureOverlay.setStyle(overlayStyleFunction);
        
        // Track the last feature for single highlight removal
        highlight = featuresToHighlight[featuresToHighlight.length - 1].feature;
    }
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