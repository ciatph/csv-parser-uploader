const { CsvToFireStore } = require('csv-firestore')

class CroppingCalendar extends CsvToFireStore {
  constructor (csvFilePath) {
    super(csvFilePath)

    /** Province { id, name }  */
    this.provinces = []

    /** Municipality {id, name, province } */
    this.municipalities = []

    /** Crop { id, name } */
    this.crops = []

    /** Cropping System { id, name } */
    this.cropping_system = []

    this.crop_stages = []

    this.count = 0
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
    case 'cropping_system':
      exists = Object.values(this.cropping_system).map(x => x.name).includes(value)
      break
    case 'crop_stage':
      exists = Object.values(this.crop_stages).map(x => x.name).includes(value)
      break
    default: break
    }

    return exists
  }

  /**
   * Remove whitespace on start and end of string
   * @param {String} value - String text
   */
  removeSpecialChars (value) {
    if (value === undefined) {
      return ''
    }

    return value.trim()
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
      const include = item.length > 0

      if (!include) {
        return
      }

      let key = item.toLowerCase()

      if (key === 'cropping system') {
        key = 'cropping_system'
      } else if (key === 'prov') {
        key = 'province'
      } else if (key === 'muni') {
        key = 'municipality'
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
          province: row.prov
        })
      }

      // Extract unique crop names
      if (key === 'crop' && !this.itemExists('crop', row[item])) {
        this.crops.push({
          id: this.crops.length + 1,
          name: row[item]
        })
      }

      // Extract unique cropping systems
      if (key === 'cropping_system' && !this.itemExists('cropping_system', row[item])) {
        this.cropping_system.push({
          id: this.cropping_system.length + 1,
          name: row[item]
        })
      }

      // Extract unique crop stages
      if (!['province', 'municipality', 'crop', 'cropping_system'].includes(key)) {
        if (!this.itemExists('crop_stage', row[item])) {
          this.crop_stages.push({
            id: this.crop_stages.length + 1,
            name: row[item]
          })
        }
      }

      if (include && ['province', 'municipality', 'crop', 'cropping_system'].includes(key)) {
        if (key === 'crop') {
          // Clean and format data (follow Crop Recommendations CSV data naming convention)
          if (row[item] === 'Rice_Irrigated') {
            obj[key] = 'Irrigated Rice'
          } else if (row[item] === 'Rice_Rainfed') {
            obj[key] = 'Rainfed Rice'
          } else {
            obj[key] = row[item]
          }
        } else {
          obj[key] = row[item]
        }
      }
    })

    // Extract and merge crop stages per month
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

    for (let i = 1; i <= 12; i += 1) {
      const mdata = []
      const index = (i < 10) ? `0${i}` : i
      const m1 = row[`${index}_15_CAL`].slice(0, row[`${index}_15_CAL`].indexOf('_'))
      const m2 = row[`${index}_30_CAL`].slice(0, row[`${index}_30_CAL`].indexOf('_'))

      mdata.push(m1)

      if (!mdata.includes(m2)) {
        mdata.push(m2)
      }

      obj[months[i - 1]] = mdata.toString()
    }

    this.csv_rows.push(obj)
  }
}

module.exports = CroppingCalendar
