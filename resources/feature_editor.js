/**
 * Feature Editor for BMP Survey Points
 * Allows users to edit attributes, add new features, and download updated data
 */

(function() {
    'use strict';
    
    window.FeatureEditor = {
        enabled: false,
        selectedFeature: null,
        editingLayer: null,
        originalData: null,
        modifyInteraction: null,
        drawInteraction: null,
        selectInteraction: null,
        initialized: false,
        
        /**
         * Initialize the feature editor
         */
        init: function(map, layer) {
            // Prevent double initialization
            if (this.initialized) {
                console.warn('Feature Editor already initialized, skipping...');
                return;
            }
            
            this.map = map;
            this.editingLayer = layer;
            
            // Ensure we start in disabled state
            this.enabled = false;
            
            // Store original data for reference
            if (window.json_BMP_Survey_Points) {
                this.originalData = JSON.parse(JSON.stringify(window.json_BMP_Survey_Points));
            }
            
            this.createEditorUI();
            this.setupInteractions();
            
            // Load saved data from localStorage if available
            const hasLocalData = this.loadFromLocalStorage();
            if (hasLocalData) {
                this.showStatus('Loaded previously edited data from browser storage.', 'info');
            }
            
            this.initialized = true;
            console.log('Feature Editor initialized. Edit mode:', this.enabled);
        },
        
        /**
         * Create the editor UI panel
         */
        createEditorUI: function() {
            // Create editor panel
            const editorPanel = document.createElement('div');
            editorPanel.id = 'feature-editor-panel';
            editorPanel.innerHTML = `
                <div class="editor-content">
                    <div class="editor-header">
                        <h3>BMP Feature Editor</h3>
                        <button id="close-editor" class="editor-close-btn" title="Close Editor">×</button>
                    </div>
                    <div class="editor-controls">
                        <button id="toggle-edit-mode" class="editor-btn" title="Enable/Disable Editing">
                            <i class="fa fa-edit"></i> Edit Mode: OFF
                        </button>
                        <button id="add-feature-btn" class="editor-btn" disabled title="Add New BMP Point">
                            <i class="fa fa-plus"></i> Add Feature
                        </button>
                        <button id="delete-feature-btn" class="editor-btn" disabled title="Delete Selected Feature">
                            <i class="fa fa-trash"></i> Delete Selected
                        </button>
                    </div>
                    <div id="feature-form-container" class="feature-form-container">
                        <p class="editor-help-text">Select a feature to edit its attributes, or click "Add Feature" to create a new one.</p>
                    </div>
                    <div id="editor-status" class="editor-status"></div>
                </div>
            `;
            
            document.body.appendChild(editorPanel);
            
            // Attach event listeners
            document.getElementById('close-editor').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeEditor();
            });
            document.getElementById('toggle-edit-mode').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleEditMode();
            });
            document.getElementById('add-feature-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startAddFeature();
            });
            document.getElementById('delete-feature-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deleteSelectedFeature();
            });
        },
        
        /**
         * Setup map interactions for editing
         */
        setupInteractions: function() {
            // Select interaction for clicking features
            this.selectInteraction = new ol.interaction.Select({
                layers: [this.editingLayer],
                style: this.getSelectedStyle()
            });
            
            this.selectInteraction.on('select', (e) => {
                if (e.selected.length > 0) {
                    this.selectedFeature = e.selected[0];
                    this.showFeatureForm(this.selectedFeature);
                    const deleteBtn = document.getElementById('delete-feature-btn');
                    if (deleteBtn) {
                        deleteBtn.disabled = false;
                    }
                } else {
                    this.selectedFeature = null;
                    this.hideFeatureForm();
                    const deleteBtn = document.getElementById('delete-feature-btn');
                    if (deleteBtn) {
                        deleteBtn.disabled = true;
                    }
                }
            });
        },
        
        /**
         * Toggle edit mode on/off
         */
        toggleEditMode: function() {
            console.log('Toggle called. Current state:', this.enabled);
            this.enabled = !this.enabled;
            console.log('New state:', this.enabled);
            
            const btn = document.getElementById('toggle-edit-mode');
            const addBtn = document.getElementById('add-feature-btn');
            
            if (this.enabled) {
                console.log('Enabling edit mode...');
                btn.innerHTML = '<i class="fa fa-edit"></i> Edit Mode: ON';
                btn.classList.add('active');
                if (addBtn) addBtn.disabled = false;
                if (this.map && this.selectInteraction) {
                    this.map.addInteraction(this.selectInteraction);
                    console.log('Select interaction added to map');
                }
                
                // Check if there's already a highlighted feature and auto-select it
                if (typeof highlight !== 'undefined' && highlight) {
                    console.log('Auto-selecting highlighted feature');
                    this.selectedFeature = highlight;
                    this.selectInteraction.getFeatures().clear();
                    this.selectInteraction.getFeatures().push(highlight);
                    this.showFeatureForm(highlight);
                    const deleteBtn = document.getElementById('delete-feature-btn');
                    if (deleteBtn) {
                        deleteBtn.disabled = false;
                    }
                }
                
                this.showStatus('✓ Edit mode enabled. Click features to edit or use "Add Feature" to create new ones.', 'success');
            } else {
                console.log('Disabling edit mode...');
                btn.innerHTML = '<i class="fa fa-edit"></i> Edit Mode: OFF';
                btn.classList.remove('active');
                if (addBtn) addBtn.disabled = true;
                if (this.map && this.selectInteraction) {
                    this.map.removeInteraction(this.selectInteraction);
                    console.log('Select interaction removed from map');
                }
                this.stopAddFeature();
                this.hideFeatureForm();
                this.showStatus('Edit mode disabled.', 'info');
            }
        },
        
        /**
         * Start adding a new feature
         */
        startAddFeature: function() {
            if (this.drawInteraction) {
                this.stopAddFeature();
                return;
            }
            
            const addBtn = document.getElementById('add-feature-btn');
            addBtn.classList.add('active');
            addBtn.innerHTML = '<i class="fa fa-times"></i> Cancel Add';
            
            // Create draw interaction for point features
            this.drawInteraction = new ol.interaction.Draw({
                source: this.editingLayer.getSource(),
                type: 'Point'
            });
            
            this.drawInteraction.on('drawend', (e) => {
                // Create default properties for new feature
                const newFeature = e.feature;
                const defaultProps = this.getDefaultProperties();
                
                // Perform spatial auto-fill
                const spatialProps = this.spatialAutoFill(newFeature);
                
                // Merge default properties with spatially-derived properties
                const finalProps = Object.assign({}, defaultProps, spatialProps);
                newFeature.setProperties(finalProps);
                
                // Show form for the new feature
                setTimeout(() => {
                    this.selectedFeature = newFeature;
                    this.selectInteraction.getFeatures().clear();
                    this.selectInteraction.getFeatures().push(newFeature);
                    this.showFeatureForm(newFeature);
                    
                    // Enable delete button for the new feature
                    const deleteBtn = document.getElementById('delete-feature-btn');
                    if (deleteBtn) {
                        deleteBtn.disabled = false;
                    }
                    
                    // Update feature counter
                    if (typeof window.updateFeatureCounts === 'function') {
                        setTimeout(window.updateFeatureCounts, 100);
                    }
                    
                    // Save to localStorage for persistence
                    this.saveToLocalStorage();
                    
                    this.showStatus('New feature added with auto-filled location attributes.', 'success');
                }, 100);
                
                this.stopAddFeature();
            });
            
            this.map.addInteraction(this.drawInteraction);
            this.showStatus('Click on the map to add a new BMP point.', 'info');
        },
        
        /**
         * Stop adding features
         */
        stopAddFeature: function() {
            if (this.drawInteraction) {
                this.map.removeInteraction(this.drawInteraction);
                this.drawInteraction = null;
                
                const addBtn = document.getElementById('add-feature-btn');
                addBtn.classList.remove('active');
                addBtn.innerHTML = '<i class="fa fa-plus"></i> Add Feature';
            }
        },
        
        /**
         * Delete the selected feature
         */
        deleteSelectedFeature: function() {
            console.log('Delete clicked. Selected feature:', this.selectedFeature);
            if (!this.selectedFeature) {
                this.showStatus('No feature selected to delete.', 'error');
                return;
            }
            
            if (confirm('Are you sure you want to delete this feature?')) {
                const source = this.editingLayer.getSource();
                source.removeFeature(this.selectedFeature);
                
                this.selectInteraction.getFeatures().clear();
                this.selectedFeature = null;
                this.hideFeatureForm();
                
                // Clear the popup and highlight overlay
                this.clearPopupAndHighlight();
                
                const deleteBtn = document.getElementById('delete-feature-btn');
                if (deleteBtn) {
                    deleteBtn.disabled = true;
                }
                
                // Update feature counter
                if (typeof window.updateFeatureCounts === 'function') {
                    setTimeout(window.updateFeatureCounts, 100);
                }
                
                // Save to localStorage for persistence
                this.saveToLocalStorage();
                
                this.showStatus('Feature deleted successfully.', 'success');
            }
        },
        
        /**
         * Show the attribute editing form for a feature
         */
        showFeatureForm: function(feature) {
            const container = document.getElementById('feature-form-container');
            const props = feature.getProperties();
            
            // Define fields to edit (excluding geometry)
            const fields = this.getEditableFields();
            
            let formHTML = '<form id="feature-attribute-form" class="feature-form">';
            formHTML += '<h4>Edit Feature Attributes</h4>';
            
            for (const field of fields) {
                const value = props[field.name] || '';
                const fieldType = field.type || 'text';
                const readonlyAttr = field.readonly ? 'readonly' : '';
                
                formHTML += `
                    <div class="form-group">
                        <label for="field-${field.name}">${field.label}:</label>
                `;
                
                if (field.options) {
                    // Dropdown for specific fields
                    const onChangeAttr = field.name === 'Project_Type' ? 'onchange="FeatureEditor.updateBMPCategory(this.value)"' : '';
                    formHTML += `<select id="field-${field.name}" name="${field.name}" class="form-control" ${onChangeAttr}>`;
                    formHTML += `<option value="">-- Select --</option>`;
                    for (const option of field.options) {
                        // Handle both simple strings and value/label objects
                        if (typeof option === 'object') {
                            const selected = value === option.value ? 'selected' : '';
                            formHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
                        } else {
                            const selected = value === option ? 'selected' : '';
                            formHTML += `<option value="${option}" ${selected}>${option}</option>`;
                        }
                    }
                    formHTML += `</select>`;
                } else if (fieldType === 'textarea') {
                    formHTML += `<textarea id="field-${field.name}" name="${field.name}" class="form-control" rows="3" ${readonlyAttr}>${value}</textarea>`;
                } else {
                    formHTML += `<input type="${fieldType}" id="field-${field.name}" name="${field.name}" value="${value}" class="form-control" ${readonlyAttr}>`;
                }
                
                formHTML += `</div>`;
            }
            
            formHTML += `
                <div class="form-actions">
                    <button type="submit" class="editor-btn editor-btn-primary">
                        <i class="fa fa-save"></i> Save Changes
                    </button>
                    <button type="button" class="editor-btn" onclick="FeatureEditor.cancelEdit()">
                        Cancel
                    </button>
                </div>
            </form>`;
            
            container.innerHTML = formHTML;
            
            // Attach form submit handler
            document.getElementById('feature-attribute-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveFeatureAttributes(feature, e.target);
            });
        },
        
        /**
         * Hide the feature form
         */
        hideFeatureForm: function() {
            const container = document.getElementById('feature-form-container');
            container.innerHTML = '<p class="editor-help-text">Select a feature to edit its attributes, or click "Add Feature" to create a new one.</p>';
        },
        
        /**
         * Update BMP Category based on Project Type
         */
        updateBMPCategory: function(projectType) {
            const stormwaterTypes = ['SWR', 'BSR', 'PP', 'BI'];
            const bmpCategoryField = document.getElementById('field-BMP_Category');
            
            if (bmpCategoryField) {
                if (stormwaterTypes.includes(projectType)) {
                    bmpCategoryField.value = 'Stormwater';
                } else if (projectType) {
                    bmpCategoryField.value = 'Agricultural';
                } else {
                    bmpCategoryField.value = '';
                }
            }
        },
        
        /**
         * Cancel editing
         */
        cancelEdit: function() {
            if (this.selectInteraction) {
                this.selectInteraction.getFeatures().clear();
            }
            this.selectedFeature = null;
            this.hideFeatureForm();
            document.getElementById('delete-feature-btn').disabled = true;
        },
        
        /**
         * Save feature attributes from form
         */
        saveFeatureAttributes: function(feature, form) {
            const formData = new FormData(form);
            
            console.log('=== SAVING FEATURE ATTRIBUTES ===');
            console.log('Before update - Implemented:', feature.get('Implemented'));
            console.log('Before update - BMP_Category:', feature.get('BMP_Category'));
            
            // First, unset any feature-specific style to ensure it uses the layer style
            feature.setStyle(undefined);
            
            // Update feature properties
            formData.forEach((value, key) => {
                console.log(`Setting ${key} = ${value}`);
                // Convert numeric values
                if (value !== '' && !isNaN(value) && value !== null) {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        feature.set(key, numValue);
                    } else {
                        feature.set(key, value);
                    }
                } else {
                    feature.set(key, value === '' ? null : value);
                }
            });
            
            console.log('After update - Implemented:', feature.get('Implemented'));
            console.log('After update - BMP_Category:', feature.get('BMP_Category'));
            console.log('All properties:', feature.getProperties());
            
            // Notify that feature properties changed
            feature.changed();
            
            // Force the layer source to re-render - remove and re-add the feature
            const source = this.editingLayer.getSource();
            source.removeFeature(feature);
            source.addFeature(feature);
            
            // Force a complete map render
            if (this.map) {
                this.map.render();
            }
            
            // Save to localStorage for persistence
            this.saveToLocalStorage();
            
            // Update feature counter
            if (typeof window.updateFeatureCounts === 'function') {
                setTimeout(window.updateFeatureCounts, 100);
            }
            
            this.showStatus('Feature attributes saved successfully!', 'success');
            
            // Clear selection and close form to provide clear feedback
            if (this.selectInteraction) {
                this.selectInteraction.getFeatures().clear();
            }
            this.selectedFeature = null;
            this.hideFeatureForm();
            
            // Clear the popup and highlight overlay
            this.clearPopupAndHighlight();
            
            // Disable delete button since nothing is selected
            const deleteBtn = document.getElementById('delete-feature-btn');
            if (deleteBtn) {
                deleteBtn.disabled = true;
            }
        },
        
        /**
         * Clear the popup and highlight overlay
         */
        clearPopupAndHighlight: function() {
            // Clear the feature highlight overlay (defined in qgis2web.js)
            if (typeof featureOverlay !== 'undefined' && featureOverlay) {
                featureOverlay.getSource().clear();
            }
            
            // Reset highlight variable (defined in qgis2web.js)
            if (typeof highlight !== 'undefined') {
                window.highlight = null;
            }
            
            // Hide the popup
            const popupContainer = document.getElementById('popup');
            if (popupContainer) {
                popupContainer.style.display = 'none';
            }
            
            // Clear popup content
            const popupContent = document.getElementById('popup-content');
            if (popupContent) {
                popupContent.innerHTML = '';
            }
        },
        
        /**
         * Save current features to localStorage for persistence
         */
        saveToLocalStorage: function() {
            try {
                const source = this.editingLayer.getSource();
                const features = source.getFeatures();
                
                const format = new ol.format.GeoJSON();
                const geojson = format.writeFeaturesObject(features, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                
                const jsContent = 'var json_BMP_Survey_Points = ' + JSON.stringify(geojson, null, 2) + ';';
                localStorage.setItem('bmp_edited_data', jsContent);
                localStorage.setItem('bmp_last_save', new Date().toISOString());
                console.log('BMP data auto-saved to localStorage');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        
        /**
         * Load features from localStorage if available
         */
        loadFromLocalStorage: function() {
            try {
                const savedData = localStorage.getItem('bmp_edited_data');
                if (savedData) {
                    const lastSave = localStorage.getItem('bmp_last_save');
                    console.log('Found saved BMP data from:', lastSave);
                    
                    // Extract the JSON from the JavaScript variable declaration
                    const jsonMatch = savedData.match(/var json_BMP_Survey_Points = ({[\s\S]*});/);
                    if (jsonMatch && jsonMatch[1]) {
                        const geojson = JSON.parse(jsonMatch[1]);
                        
                        // Clear existing features
                        const source = this.editingLayer.getSource();
                        source.clear();
                        
                        // Load saved features
                        const format = new ol.format.GeoJSON();
                        const features = format.readFeatures(geojson, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857'
                        });
                        
                        source.addFeatures(features);
                        console.log(`Loaded ${features.length} features from localStorage`);
                        
                        // Update feature counter
                        if (typeof window.updateFeatureCounts === 'function') {
                            setTimeout(window.updateFeatureCounts, 500);
                        }
                        
                        return true;
                    }
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
            return false;
        },
        
        /**
         * Clear saved data from localStorage
         */
        clearLocalStorage: function() {
            localStorage.removeItem('bmp_edited_data');
            localStorage.removeItem('bmp_last_save');
            console.log('Cleared BMP data from localStorage');
        },
        
        /**
         * Download updated data as .js file
         */
        downloadUpdatedData: function() {
            try {
                // Get all features from the layer
                const source = this.editingLayer.getSource();
                const features = source.getFeatures();
                
                // Convert to GeoJSON
                const format = new ol.format.GeoJSON();
                const geojson = format.writeFeaturesObject(features, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                
                // Create JavaScript file content
                const jsContent = `var json_BMP_Survey_Points = ${JSON.stringify(geojson, null, 2)};`;
                
                // Create blob and download
                const blob = new Blob([jsContent], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `BMP_Survey_Points_${new Date().toISOString().split('T')[0]}.js`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Also update sessionStorage
                sessionStorage.setItem('bmp_data', jsContent);
                
                this.showStatus('Data downloaded successfully! File: ' + a.download, 'success');
            } catch (error) {
                this.showStatus('Error downloading data: ' + error.message, 'error');
                console.error('Download error:', error);
            }
        },
        
        /**
         * Close the editor
         */
        closeEditor: function() {
            if (this.enabled) {
                this.toggleEditMode();
            }
            
            const panel = document.getElementById('feature-editor-panel');
            if (panel) {
                panel.style.display = 'none';
            }
        },
        
        /**
         * Show the editor panel
         */
        show: function() {
            const panel = document.getElementById('feature-editor-panel');
            const featureCounter = document.getElementById('feature-counter');
            
            if (panel) {
                // Match the width of the feature counter
                if (featureCounter) {
                    const counterWidth = featureCounter.offsetWidth;
                    panel.style.width = counterWidth + 'px';
                }
                
                panel.style.display = 'block';
                
                // Check if sidebar is open and adjust position
                this.updatePositionForSidebar();
            }
        },
        
        /**
         * Update panel position based on sidebar state
         */
        updatePositionForSidebar: function() {
            const panel = document.getElementById('feature-editor-panel');
            const sidebar = document.querySelector('.sidebar');
            
            if (panel && sidebar) {
                if (sidebar.classList.contains('collapsed')) {
                    panel.classList.remove('sidebar-open');
                } else {
                    panel.classList.add('sidebar-open');
                }
            }
        },
        
        /**
         * Show status message
         */
        showStatus: function(message, type) {
            const statusDiv = document.getElementById('editor-status');
            statusDiv.textContent = message;
            statusDiv.className = 'editor-status editor-status-' + type;
            statusDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        },
        
        /**
         * Perform spatial intersection to auto-fill attributes
         */
        spatialAutoFill: function(feature) {
            const geometry = feature.getGeometry();
            const coordinate = geometry.getCoordinates();
            const point = new ol.geom.Point(coordinate);
            
            const properties = {};
            
            // Check Municipality
            if (typeof lyr_Municipality_Boundaries !== 'undefined') {
                const municipalitySource = lyr_Municipality_Boundaries.getSource();
                const municipalityFeatures = municipalitySource.getFeatures();
                
                for (let i = 0; i < municipalityFeatures.length; i++) {
                    const muni = municipalityFeatures[i];
                    const muniGeom = muni.getGeometry();
                    if (muniGeom && muniGeom.intersectsCoordinate(coordinate)) {
                        properties.Municipality = muni.get('MUNICIPAL_NAME') || '';
                        break;
                    }
                }
            }
            
            // Check Critical Recharge Area (0 or 1)
            properties.In_Critical_Recharge = 0;
            if (typeof lyr_critical_recharge_area_footprint !== 'undefined') {
                const rechargeSource = lyr_critical_recharge_area_footprint.getSource();
                const rechargeFeatures = rechargeSource.getFeatures();
                
                for (let i = 0; i < rechargeFeatures.length; i++) {
                    const recharge = rechargeFeatures[i];
                    const rechargeGeom = recharge.getGeometry();
                    if (rechargeGeom && rechargeGeom.intersectsCoordinate(coordinate)) {
                        properties.In_Critical_Recharge = 1;
                        break;
                    }
                }
            }
            
            // Check HUC12
            if (typeof lyr_HUC12_Boundaries_6 !== 'undefined') {
                const huc12Source = lyr_HUC12_Boundaries_6.getSource();
                const huc12Features = huc12Source.getFeatures();
                
                for (let i = 0; i < huc12Features.length; i++) {
                    const huc = huc12Features[i];
                    const hucGeom = huc.getGeometry();
                    if (hucGeom && hucGeom.intersectsCoordinate(coordinate)) {
                        properties.HUC12_Code = huc.get('huc12') || '';
                        properties.HUC12_Name = huc.get('name') || '';
                        break;
                    }
                }
            }
            
            // Check SRBC Focus Areas
            if (typeof lyr_SRBC_Focus_Areas_8 !== 'undefined') {
                const srbcSource = lyr_SRBC_Focus_Areas_8.getSource();
                const srbcFeatures = srbcSource.getFeatures();
                
                for (let i = 0; i < srbcFeatures.length; i++) {
                    const srbc = srbcFeatures[i];
                    const srbcGeom = srbc.getGeometry();
                    if (srbcGeom && srbcGeom.intersectsCoordinate(coordinate)) {
                        properties.SRBC_Focus_Area_Name = srbc.get('FocusArea') || '';
                        properties.SRBC_Focus_Purpose = srbc.get('Purpose') || '';
                        properties.SRBC_Area_Order = srbc.get('FocusAreaN') || null;
                        break;
                    }
                }
            }
            
            // Check Priority Subwatershed (from Delisting Catchments)
            if (typeof lyr_Delisting_Catchments !== 'undefined') {
                const catchmentSource = lyr_Delisting_Catchments.getSource();
                const catchmentFeatures = catchmentSource.getFeatures();
                
                for (let i = 0; i < catchmentFeatures.length; i++) {
                    const catchment = catchmentFeatures[i];
                    const catchmentGeom = catchment.getGeometry();
                    if (catchmentGeom && catchmentGeom.intersectsCoordinate(coordinate)) {
                        properties.Priority_Subwatershed = catchment.get('NAME') || '';
                        break;
                    }
                }
            }
            
            return properties;
        },
        
        /**
         * Get default properties for new features
         */
        getDefaultProperties: function() {
            // Calculate next OBJECTID (highest + 1)
            let maxObjectID = 0;
            if (this.editingLayer) {
                const features = this.editingLayer.getSource().getFeatures();
                features.forEach(f => {
                    const objId = f.get('OBJECTID');
                    if (objId && objId > maxObjectID) {
                        maxObjectID = objId;
                    }
                });
            }
            
            return {
                OBJECTID: maxObjectID + 1,
                Project_Type: '',
                Landowner: '',
                Unique_Landowner_ID: '',
                FarmerTracker: '',
                Impervious_Sq_Meters: null,
                Area_Sq_Meters: null,
                Prop_Impervious: null,
                Universal_ID: '',
                BMP_ID: '',
                Source: '',
                Source_Year: new Date().getFullYear(),
                Project_Description: '',
                Local_ID: '',
                BMP_Category: '', // Will be auto-filled based on Project_Type
                Implemented: 'no', // Default to Potential (no)
                Municipality: '',
                HUC12_Code: '',
                HUC12_Name: '',
                In_Critical_Recharge: 0,
                SRBC_Focus_Area_Name: '',
                SRBC_Focus_Purpose: '',
                SRBC_Area_Order: null,
                Priority_Subwatershed: '',
                Catchment_IBI_Category: '' // Not available, left blank
            };
        },
        
        /**
         * Get editable fields configuration
         */
        getEditableFields: function() {
            return [
                { name: 'Project_Type', label: 'Project Type', options: [
                    { value: 'PM', label: 'PM - Pasture Management' },
                    { value: 'GW', label: 'GW - Grassed Waterway' },
                    { value: 'T/D', label: 'T&D - Terraces/Diversions' },
                    { value: 'CSC', label: 'CSC - Contour Strip Cropping' },
                    { value: 'NT', label: 'NT - No-Till' },
                    { value: 'RB', label: 'RB - Riparian Buffer' },
                    { value: 'SR', label: 'SR - Stream Restoration' },
                    { value: 'FR', label: 'FR - Floodplain Restoration' },
                    { value: 'CC', label: 'CC - Cover Crop' },
                    { value: 'WR', label: 'WR - Wetland Restoration' },
                    { value: 'SWR', label: 'SWR - Stormwater Retrofit' },
                    { value: 'BSR', label: 'BSR - Bioswale/Rain Garden' },
                    { value: 'PP', label: 'PP - Porous Pavement' },
                    { value: 'BI', label: 'BI - Bioinfiltration' }
                ]},
                { name: 'Landowner', label: 'Landowner', type: 'text' },
                { name: 'BMP_Category', label: 'BMP Category', type: 'text', readonly: true },
                { name: 'Implemented', label: 'Implementation Status', options: [
                    { value: 'no', label: 'Potential' },
                    { value: 'yes', label: 'Implemented' },
                    { value: 'planned', label: 'Planned' }
                ]},
                { name: 'Project_Description', label: 'Project Description', type: 'textarea' },
                { name: 'Source', label: 'Source', type: 'text' },
                { name: 'Source_Year', label: 'Source Year', type: 'number' },
                { name: 'Municipality', label: 'Municipality', type: 'text' },
                { name: 'HUC12_Name', label: 'HUC12 Name', type: 'text' },
                { name: 'Priority_Subwatershed', label: 'Priority Subwatershed', type: 'text' },
                { name: 'Priority_Score', label: 'Priority Score', type: 'number' },
                { name: 'Address', label: 'Address', type: 'text' }
            ];
        },
        
        /**
         * Get style for selected features
         */
        getSelectedStyle: function() {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({ color: 'rgba(255, 255, 0, 0.6)' }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 200, 0, 1)',
                        width: 3
                    })
                })
            });
        }
    };
})();
