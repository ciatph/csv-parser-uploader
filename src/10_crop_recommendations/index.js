const path = require('path')
const { FirestoreData } = require('csv-firestore')
const CropRecommendations = require('./crop_recommendations')

const main = async () => {
  const Firestore = new FirestoreData()
  const handler = new CropRecommendations(path.resolve(__dirname, 'Crop-Recommendations-CSV-File.csv'))
  const upload = false
  const write = true

  // Crop Recommendations-specific tables and firestore collection names
  const newTables = {
    provinces: 'n_provinces',
    municipalities: 'n_municipalities',
    crops: 'n_crops',
    crop_stages: 'n_crop_stages',
    activities: 'n_activities',
    recommendations: 'n_list_recommendations',
    subrecommendations: 'n_list_subrecommendations',
    smsrecommendations: 'n_list_smsrecommendations'
  }

  try {
    console.log('Reading CSV...')
    await handler.readCSV()

    if (upload) {
      console.log('\nUploading data to firestore...')
      const toUpload = [handler.firestoreUpload('n_crop_recommendations')]

      for (collection in newTables) {
        toUpload.push(handler.firestoreUpload(newTables[collection], true, handler[collection]))
      }

      await Promise.all(toUpload)

      // Upload to simple data collection
      const jsonData = {
        mains: handler.recommendations,
        subs: handler.subrecommendations,
        sms: handler.smsrecommendations
      }

      await Firestore.db
        .collection('recommendations')
        .doc('data')
        .set(jsonData)
    }

    if (write) {
      console.log('\nWriting data to CSV...')
      handler.write(handler.data(), path.resolve(__dirname, 'data.csv'))

      for (collection in newTables) {
        handler.write(handler[collection], path.resolve(__dirname, `${newTables[collection]}.csv`))
      }
    }

    console.log('\n------------------------------\nProcessing finished. Stats:')
    console.log(`crop recommendations: ${handler.data().length}`)

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
