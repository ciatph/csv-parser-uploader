## csv-parser-uploader

Parse normalized (general) rainfed rice recommendations data for the Crop Recommendations page and upload to Firestore.

## Requirements

1. NodeJS 14.18.3 or higher
2. Firebase requirements for [csv-firestore](https://www.npmjs.com/package/csv-firestore)
3. Normalized rainfed rice recommendations data (CSV)

## Installation

1. Clone this repository.  
`git clone https://github.com/ciatph/csv-parser-uploader.git`
2. Install dependencies.  
   - `npm install`
   - Set-up **csv-firestore**'s local Firebase requirements
3. Copy associated CSV input files to their respective directories:
   - /01_selection_of_activities
   - /02_land_preparation
   - /03_method_of_planting
   - /04_nutrition_management
   - /05_water_management
   - /06_pest_and_weed

## Usage

1. Run any of the [available scripts](#available-scripts).


## Firestore Collections Reference

### Selection of Varieties

- /cr_sel_varieties - normalized and mapped selection of varieties list
- /cr_sel_varieties_recommendations - unique recommendations masterlist for selection of varieties
- /cr_sel_varieties_provinces - unique provinces masterlist for selection of varieties

### Land Preparation

- /cr_landpreps - normalized and mapped land preparations
- /cr_landpreps_recommendations unique - recommendations masterlist for land preparations

### Method of Planting

- /cr_planting_methods - normalized and mapped planting methods
- /cr_planting_methods_recommendations - unique recommendations masterlist for planting methods

### Nutrition Management

- /cr_nutrition_mgt - normalized and mapped nutrition management methods
- /cr_nutrition_mgt_recommendations - unique recommendations masterlist for nutrition management methods

### Water Management

- /cr_water_mgt - normalized and mapped water management methods
- /cr_water_mgt_recommendations - unique recommendations masterlist for water management methods

### Pest and Weed Management

- /cr_water_mgt - normalized and mapped water management methods
- /cr_water_mgt_recommendations - unique recommendations masterlist for water management methods


## Available Scripts

### `npm run upload:varieties`

Create recommendations and provinces mappings for the (normalized) selection of varieties data and upload to Firestore.

```
/cr_sel_varieties
/cr_sel_varieties_recommendations
/cr_sel_varieties_provinces
```

### `npm run upload:landprep`

Create recommendations mappings for the (normalized) land preparation data and upload to Firestore.

```
/cr_landpreps
/cr_landpreps_recommendations
```

### `npm run upload:planting`

Create recommendations mappings for the (normalized) method of planting data and upload to Firestore.

```
/cr_planting_methods
/cr_planting_methods_recommendations
```

### `npm run upload:nutrition`

Create recommendations mappings for the (normalized) nutrition management data and upload to Firestore.

```
/cr_nutrition_mgt
/cr_nutrition_mgt_recommendations
```

### `npm run upload:water`

Create recommendations mappings for the (normalized) water management data and upload to Firestore.

```
/cr_water_mgt
/cr_water_mgt_recommendations
```

### `npm run upload:pestweed`

Create recommendations mappings for the (normalized) pest and weed management data and upload to Firestore.

```
/cr_pestweed_mgt
/cr_pestweed_mgt_recommendations
```

@ciatph  
20220324
