const { CsvToFireStore } = require('csv-firestore')

class FirestoreNutritionMgt extends CsvToFireStore {
  constructor (csvFilePath) {
    super(csvFilePath)
    console.log(`Reading ${csvFilePath}`)

    this.csv_rows = {
      nutrition_mgt_list: [],
      recommendations_list: [],
      recommendations: []
    }
  }

  read (row) {
    if (!this.csv_rows.recommendations.includes(row.con_normal)) {
      // Build unique recommendations list
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
      nutri: row.method,
      norm,
      wet,
      dry
    }

    // Build mapped land preparation selections
    this.csv_rows.nutrition_mgt_list.push(obj)
  }

  end () {
    this.write(this.csv_rows.nutrition_mgt_list, 'cr_nutrition_mgt.csv')
    this.write(this.csv_rows.recommendations_list, 'cr_nutrition_mgt_recommendations.csv')
  }
}

module.exports = FirestoreNutritionMgt
