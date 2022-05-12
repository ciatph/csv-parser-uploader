const path = require('path')
const CroppingCalendar = require('./cropping_calendar')

const main = async () => {
  const handler = new CroppingCalendar(path.resolve(__dirname, 'Cropping-Calendar_all.csv'))
  const upload = true
  const write = true

  // Cropping Calendar-specific tables and firestore collection names
  const newTables = {
    provinces: 'n_provinces',
    municipalities: 'n_municipalities',
    crops: 'n_crops',
    cropping_system: 'n_cropping_system',
    crop_stages: 'n_crop_stages'
  }

  try {
    console.log('Reading CSV...')
    await handler.readCSV()

    if (upload) {
      console.log('\nUploading data to firestore...')
      await handler.firestoreUpload('n_cropping_calendar_merged')
    }

    if (write) {
      console.log('\nWriting data to CSV...')
      handler.write(handler.data(), path.resolve(__dirname, 'data.csv'))

      for (collection in newTables) {
        handler.write(handler[collection], path.resolve(__dirname, `${newTables[collection]}.csv`))
      }
    }

    console.log('\n------------------------------\nProcessing finished. Stats:')
    console.log(`cropping calendar: ${handler.data().length}`)

    for (collection in newTables) {
      handler.write(handler[collection], path.resolve(__dirname, `${newTables[collection]}.csv`))
      console.log(`${collection}: ${handler[collection].length}`)
    }

    console.log('\n')
  } catch (err) {
    console.log(err)
  }
}

(async () => {
  await main()
})()
