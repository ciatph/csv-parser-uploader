const { CsvToFireStore } = require('csv-firestore')

/**
 * Read the normalized rainfed recommedations CSV file,
 * Create recommendations (Integer) mappings for normal, wet and drier seasons,
 * Generate CSV files of normalized and mapped (Selection of Activities):
 *  - varieties selections list => cr_sel_varieties.csv
 *  - crop recommendations masterlist => cr_sel_varieties_recommendations.csv
 *  - provinces list => cr_sel_varieties_provinces.csv
 */
class FirestoreActivities extends CsvToFireStore {
  constructor(csvFilePath) {
    super(csvFilePath)

    this.csv_rows = {
      varieties_list: [],
      recommendations_list: [],
      recommendations: [],
      province_list: [],
      provinces: []
    }
  }

  read (row) {
    if (!this.csv_rows.recommendations.includes(row.con_normal)) {
      // Build unique recommendations list - (firestore) rec_recommedations collection
      this.csv_rows.recommendations.push(row.con_normal)
      this.csv_rows.recommendations_list.push({
        id: this.csv_rows.recommendations.length,
        name: row.con_normal
      })
    }

    if (!this.csv_rows.recommendations.includes(row.con_wet)) {
      this.csv_rows.recommendations.push(row.con_wet)
      this.csv_rows.recommendations_list.push({
        id: this.csv_rows.recommendations.length,
        name: row.con_wet
      })
    }
    
    if (!this.csv_rows.recommendations.includes(row.con_drier)) {
      this.csv_rows.recommendations.push(row.con_drier)
      this.csv_rows.recommendations_list.push({
        id: this.csv_rows.recommendations.length,
        name: row.con_drier
      })
    }

    const norm = this.csv_rows.recommendations.indexOf(row.con_normal) + 1
    const wet = this.csv_rows.recommendations.indexOf(row.con_wet) + 1
    const dry = this.csv_rows.recommendations.indexOf(row.con_drier) + 1

    const obj = {
      prov: row.prov,
      norm,
      wet,
      dry
    }

    // Build mapped activity selections - (firestore) rec_selections collection
    this.csv_rows.varieties_list.push(obj)

    // Build unique provinces - (firestore) rec_provinces collection
    if (!this.csv_rows.provinces.includes(row.prov)) {
      this.csv_rows.provinces.push(row.prov)
      this.csv_rows.province_list.push({
        id: this.csv_rows.provinces.length,
        label: row.prov
      })
    }
  }

  end () {
    this.write(this.csv_rows.varieties_list, 'cr_sel_varieties.csv')
    this.write(this.csv_rows.recommendations_list, 'cr_sel_varieties_recommendations.csv')
    this.write(this.csv_rows.province_list, 'cr_sel_varieties_provinces.csv')
  }  
}

module.exports = FirestoreActivities
