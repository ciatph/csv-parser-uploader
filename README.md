## csv-parser-uploader

Parse normalized rainfed rice recommendations data for the Crop Recommendations page and upload to Firestore.

## Requirements

1. NodeJS 14.18.3 or higher
2. Firebase requirements for [csv-firestore](https://www.npmjs.com/package/csv-firestore)
3. Normalized rainfed rice recommendations data (CSV)


## Firestore Collections Reference

### Selection of Varieties

- /cr_sel_varieties - normalized and mapped selection of varieties list
- /cr_sel_varieties_recommendations - unique recommendations masterlist for selection of varieties
- /cr_sel_varieties_provinces - unique provinces masterlist for selection of varieties


### Land Preparation

- /cr_landpreps - normalized and mapped land preparations
- /cr_landpreps_recommendations unique recommendations masterlist for land preparations


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

@ciatph  
20220324
