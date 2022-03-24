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
3. Copy associated CSV files to the /01_selection_of_activities and /02_land_preparation directories.

## Usage

1. Run any of the [available scripts](#available-scripts).


## Firestore Collections Reference

### Selection of Varieties

- /cr_sel_varieties - normalized and mapped selection of varieties list
- /cr_sel_varieties_recommendations - unique recommendations masterlist for selection of varieties
- /cr_sel_varieties_provinces - unique provinces masterlist for selection of varieties

### Land Preparation

- /cr_landpreps - normalized and mapped land preparations
- /cr_landpreps_recommendations unique recommendations masterlist for land preparations

### Method of Planting

- /cr_planting_methods - normalized and mapped planting methods
- /cr_planting_methods_recommendations unique recommendations masterlist for planting methods

### Nutrition Management

- /cr_nutrition_mgt - normalized and mapped nutrition management methods
- /cr_nutrition_mgt_recommendations unique recommendations masterlist for nutrition managemen methods


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

Create recommendations mappings for the (normalized) method of planting data and upload to Firestore.

```
/cr_nutrition_mgt
/cr_nutrition_mgt_recommendations
```

@ciatph  
20220324
