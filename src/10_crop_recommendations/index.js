const path = require('path')
const CropRecommendations = require('./crop_recommendations')

const main = async () => {
  const handler = new CropRecommendations(path.resolve(__dirname, 'Crop-Recommendations-CSV-File.csv'))

  try {
    console.log('Reading CSV...')
    await handler.readCSV()

    console.log('Uploading data to firestore...')
    /*
    await handler.firestoreUpload('n_crop_recommendations')
    await handler.firestoreUpload('n_provinces', true, handler.provinces)
    await handler.firestoreUpload('n_municipalities', true, handler.municipalities)
    await handler.firestoreUpload('n_crops', true, handler.crops)
    await handler.firestoreUpload('n_activities', true, handler.activities)
    */
    console.log('Writing data to CSV...')
    handler.write(handler.data(), path.resolve(__dirname, 'data.csv'))
    handler.write(handler.provinces, path.resolve(__dirname, 'provinces.csv'))
    handler.write(handler.municipalities, path.resolve(__dirname, 'municipalities.csv'))
    handler.write(handler.crops, path.resolve(__dirname, 'crops.csv'))
    handler.write(handler.activities, path.resolve(__dirname, 'activities.csv'))

    console.log('done')
  } catch (err) {
    console.log(err)
  }
}

(async () => {
  await main()
})()
