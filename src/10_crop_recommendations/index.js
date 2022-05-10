const path = require('path')
const CropRecommendations = require('./crop_recommendations')

const main = async () => {
  const handler = new CropRecommendations(path.resolve(__dirname, 'Crop-Recommendations-CSV-File.csv'))

  try {
    console.log('Reading CSV...')
    await handler.readCSV()

    console.log('\nUploading data to firestore...')
    await handler.firestoreUpload('n_crop_recommendations')
    await handler.firestoreUpload('n_provinces', true, handler.provinces)
    await handler.firestoreUpload('n_municipalities', true, handler.municipalities)
    await handler.firestoreUpload('n_crops', true, handler.crops)
    await handler.firestoreUpload('n_crop_stages', true, handler.crop_stages)
    await handler.firestoreUpload('n_activities', true, handler.activities)
    await handler.firestoreUpload('n_list_recommendations', true, handler.recommendations)
    await handler.firestoreUpload('n_list_subrecommendations', true, handler.subrecommendations)  

    console.log('\nWriting data to CSV...')
    handler.write(handler.data(), path.resolve(__dirname, 'data.csv'))

    handler.write(handler.provinces, path.resolve(__dirname, 'provinces.csv'))
    handler.write(handler.municipalities, path.resolve(__dirname, 'municipalities.csv'))
    handler.write(handler.crops, path.resolve(__dirname, 'crops.csv'))
    handler.write(handler.crop_stages, path.resolve(__dirname, 'crop_stages.csv'))
    handler.write(handler.activities, path.resolve(__dirname, 'activities.csv'))
    handler.write(handler.recommendations, path.resolve(__dirname, 'recommendations_masterlist.csv'))
    handler.write(handler.subrecommendations, path.resolve(__dirname, 'recommendations_sub_masterlist.csv'))

    console.log('done')
    console.log(`provinces: ${handler.provinces.length}`)
    console.log(`municipalities: ${handler.municipalities.length}`)
    console.log(`crops: ${handler.crops.length}`)
    console.log(`crop_stages: ${handler.crop_stages.length}`)
    console.log(`activities: ${handler.activities.length}`)
  } catch (err) {
    console.log(err)
  }
}

(async () => {
  await main()
})()
