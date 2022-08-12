const { Hilipsum } = require('hili-lipsum')
const { CsvToFireStore } = require('csv-firestore')

class CropRecommedations extends CsvToFireStore {
  /** Random sentence generator */
  #hiliwords = null

  constructor (csvFilePath) {
    super(csvFilePath)

    /** Province { id, name }  */
    this.provinces = []

    /** Municipality {id, name, province } */
    this.municipalities = []

    /** Crop { id, name } */
    this.crops = []

    /** Activity { id, name } */
    this.activities = []

    /** Crop stages { id, name } */
    this.crop_stages = []

    /** Crop Recommendations { id, description } */
    this.recommendations = []

    /** Sub recommendations { id, description } */
    this.subrecommendations = []

    /** Random words counterpart of each item in this.recommendations[]  */
    this.smsrecommendations = []

    this.count = 0

    this.#hiliwords = new Hilipsum()
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
    case 'stage':
      exists = Object.values(this.crop_stages).map(x => x.name).includes(value)
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

    const str = value.replace(/(\r\n|\n|\r|•)/gm, '')
    return str.charAt(0) === '-'
      ? str.slice(1)
      : str
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
   * Encode unique MAIN crop recommendations
   * @param {String} text - Main crop recommendation (cleaned)
   */
  createMainRecommendation (text) {
    let id = -1

    if (!this.itemExists('recommendation', text)) {
      this.recommendations.push({
        id: this.recommendations.length + 1,
        description: text
      })

      id = this.recommendations.length

      // Generate a random sentence counterpart
      this.smsrecommendations.push({
        id,
        description: this.#hiliwords.lipsum(40)
      })
    } else {
      id = this.recommendations.find(x => x.description === text).id
    }

    return id
  }

  /**
   * Override CsvToFireStore's read() method to parse the crop recommedations CSV file
   * @param {Object} row - Read row in a CSV file with keys as CSV headers
   */
  read (row) {
    this.count += 1
    const headers = Object.keys(row)
    const obj = { id: this.count }

    headers.forEach(item => {
      const weatherConditions = ['Normal', 'Wetter', 'Drier']
      const include = item.length > 0

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

      // Extract unique crop stages
      if (key === 'stage' && !this.itemExists('stage', row[item])) {
        this.crop_stages.push({
          id: this.crop_stages.length + 1,
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
      let smsrecs = -1

      // Extract unique MAIN and SUB recommendations across 'normal', 'wetter' and 'dry' conditions
      if (weatherConditions.map(x => x.toLowerCase()).includes(key)) {
        // Each condition will only have (1) random sentence
        let smsRecommendation = -1

        if (row[item].indexOf('•') >= 0) {
          // List of (nested lines) recommendations
          // Succeeding lines may or may not have '•' or '-' prefix
          const lines = row[item].split('\n')

          lines.forEach((line, index) => {
            const tempRec = { id: -1, subs: [], ul: true }

            if (this.isMainItem(line) || (line.length > 0 && !this.isSubItem(line))) {
              // MAIN recommendation
              const clean = this.removeSpecialChars(line)

              if (!this.isMainItem(line) && line.length > 0 && !this.isSubItem(line)) {
                // These are lines with no '•' or '-' prefix
                // Treat these as MAIN recommendations (for formatting purposes)
                tempRec.ul = false
              }

              // Extract unique MAIN recommendations
              tempRec.id = this.createMainRecommendation(clean)
              if (tempRec.id === -1) {
                throw new Error('Illegal ID')
              }

              if (smsRecommendation === -1) {
                smsRecommendation = tempRec.id
              }

              // Check for succeeding sub-items (SUB recommendations)
              const idx = index + 1

              for (let i = idx; i < lines.length; i += 1) {
                if (this.isSubItem(lines[i])) {
                  const cleanSub = this.removeSpecialChars(lines[i])

                  // Extract unique SUB recommendations
                  if (!this.itemExists('sub', cleanSub)) {
                    this.subrecommendations.push({
                      id: this.subrecommendations.length + 1,
                      description: cleanSub
                    })

                    tempRec.subs.push(this.subrecommendations.length)
                  } else {
                    tempRec.subs.push(this.subrecommendations.find(x => x.description === cleanSub).id)
                  }
                } else {
                  break
                }
              }

              recs.push(tempRec)
            }
          })

          smsrecs = smsRecommendation
        } else {
          // One-liner recommendation
          // These csv cells lines with no '•' or '-' prefix
          // Treat these as MAIN recommendations (for formatting purposes)
          console.log('normal recommendation')

          const lines = row[item].split('\n')

          lines.forEach((line, index) => {
            const tempRec = { id: -1, subs: [], ul: false }
            const cleanMisc = this.removeSpecialChars(line)
            tempRec.id = this.createMainRecommendation(cleanMisc)

            if (tempRec.id === -1) {
              throw new Error('Illegal ID')
            }

            if (smsRecommendation === -1) {
              smsRecommendation = tempRec.id
            }

            recs.push(tempRec)
          })

          smsrecs = smsRecommendation
        }
      }

      if (include) {
        if (weatherConditions.map(x => x.toLowerCase()).includes(key)) {
          obj[key] = JSON.stringify(recs)
          obj[`${key}_sms`] = smsrecs
        } else {
          obj[key] = row[item]
        }
      }
    })

    this.csv_rows.push(obj)
  }
}

module.exports = CropRecommedations
