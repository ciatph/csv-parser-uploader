const path = require('path')
const { CsvToFireStore } = require('csv-firestore')

const main = async () => {
  const handler = new CsvToFireStore(path.resolve(__dirname, 'regions_provinces.csv'))

  try {
    await handler.readCSV()
    console.log('csv read done')
  } catch (err) {
    console.log(err.message)
  }

  if (handler.data()) {
    try {
      await handler.firestoreUpload('const_regions')
      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
