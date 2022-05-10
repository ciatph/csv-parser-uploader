const { CsvToFireStore } = require('csv-firestore')

class CropRecommedations extends CsvToFireStore {
  constructor(csvFilePath) {
    super(csvFilePath)
    
    /** Province { id, name }  */
    this.provinces = []

    /** Municipality {id, name, province } */
    this.municipalities = []

    /** Crop { id, name } */
    this.crops = []

    /** Activity { id, name } */
    this.activities = []

    /** Crop Recommendations { id, description } */
    this.recommendations = []

    /** Sub recommendations { id, description } */
    this.subrecommendations = []
  }

  /**
   * Check if a value exists in a specified Object[] array
   * @param {String} param - Array name to check 
   * @param {*} value - Value to find in the Object[] array
   */
  itemExists (param, value) {
    let exists = false

    switch (param) {
      case 'province':
        exists = Object.values(this.provinces).map(x => x.name).includes(value)
        break
      case 'municipality':
        exists = Object.values(this.municipalities).map(x => x.name).includes(value)
        break
      case 'crop':
        exists = Object.values(this.crops).map(x => x.name).includes(value)
        break
      case 'activity':
        exists = Object.values(this.activities).map(x => x.name).includes(value)
        break
        case 'recommendation':
          exists = Object.values(this.recommendations).map(x => x.description).includes(value)
          break
        case 'sub':
          exists = Object.values(this.subrecommendations).map(x => x.description).includes(value)
          break
      default: break
    }

    return exists
  }

  /**
   * Remove all special characters from a string of text
   * @param {String} value - String text
   */
  removeSpecialChars (value) {
    if (value === undefined) {
      return ''
    }

    return value.replace(/(?!\w|\s)./g, '')
      .replace(/\s+/g, ' ')
      .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2')
  }

  /**
   * Check if a text is a main recommendaation
   * @param {String} text - Text to search 
   */
  isMainItem (text) {
    if (text === undefined) {
      return false
    }

    return text.indexOf('•') === 0
  }

  /**
   * Check if a text is a sub recommendaation
   * @param {String} text - Text to search 
   */  
  isSubItem (text) {
    if (text === undefined) {
      return false
    }

    return text.indexOf('-') === 0
  }

  /**
   * Override CsvToFireStore's read() method to parse the crop recommedations CSV file
   * @param {Object} row - Read row in a CSV file with keys as CSV headers
   */
  read (row) {
    const headers = Object.keys(row)
    const obj = {}

    headers.forEach(item => {
      const weatherConditions = ['Normal', 'Wetter', 'Drier']
      let include = item.length > 0

      if (!include) {
        return
      }

      let key = item.toLowerCase()

      if (key === 'crop stage') {
        key = 'stage'
      }

      // Extract unique provinces
      if (key === 'province' && !this.itemExists('province', row[item])) {
        this.provinces.push({
          id: this.provinces.length + 1,
          name: row[item]
        })
      }

      // Extract unique municipalities
      if (key === 'municipality' && !this.itemExists('municipality', row[item])) {
        this.municipalities.push({
          id: this.municipalities.length + 1,
          name: row[item],
          province: row.Province
        })
      }

      // Extract unique crop names
      if (key === 'crop' && !this.itemExists('crop', row[item])) {
        this.crops.push({
          id: this.crops.length + 1,
          name: row[item]
        })
      }

      // Extract unique activities
      if (key === 'activity' && !this.itemExists('activity', row[item])) {
        this.activities.push({
          id: this.activities.length + 1,
          name: row[item]
        })
      }

      const recs = []

      // Extract unique recommendations across 'normal', 'wetter' and 'dry' conditions
      if (weatherConditions.map(x => x.toLowerCase()).includes(key)) {
        if (row[item].indexOf('•') >= 0) {
          // List of main (nested) recommendations
          const lines = row[item].split('\n')

          lines.forEach((line, index) => {
            // const tempRec = { id: -1, subs: [] }
            let tempRec = ''
    
            if (this.isMainItem(line)) {
              const clean = this.removeSpecialChars(line)

              // Extract unique main recommendations
              if (!this.itemExists('recommendation', clean)) {
                this.recommendations.push({
                  id: this.recommendations.length + 1,
                  description: clean
                })

                // tempRec.id = this.recommendations.length
                tempRec += this.recommendations.length + '|'
              } else {
                // tempRec.id = this.recommendations.map(x => x.description).indexOf(clean)
                tempRec += this.recommendations.map(x => x.description).indexOf(clean) + '|'
              }

              // Check for succeeding sub-items
              let idx = index + 1

              for (let i = idx; i < lines.length; i += 1) {
                if (this.isSubItem(lines[i])) {
                  const cleanSub = this.removeSpecialChars(lines[i])

                  // Extract unique sub recommendations
                  if (!this.itemExists('sub', cleanSub)) {
                    this.subrecommendations.push({
                      id: this.subrecommendations.length + 1,
                      description: cleanSub
                    })

                    // tempRec.subs.push(this.subrecommendations.length)
                    tempRec += this.subrecommendations.length + '-'
                  } else {
                    // tempRec.subs.push(this.subrecommendations.map(x => x.description).indexOf(cleanSub))
                    tempRec += this.subrecommendations.map(x => x.description).indexOf(cleanSub) + '-'
                  }
                } else {
                  break
                }
              }


              recs.push(tempRec.substr(0, tempRec.length - 1))
            }
          })
        } else {
          // One-liner (main)recommendations
          console.log('normal recommendation')        
        }
      }

      if (include) {
        if (weatherConditions.map(x => x.toLowerCase()).includes(key)) {
          obj[key] = JSON.stringify(recs)
        } else {
          obj[key] = row[item]
        }
      }
    })

    this.csv_rows.push(obj)
  }  
}

module.exports = CropRecommedations
