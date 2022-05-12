const path = require('path')
const FirestoreLandprep = require('./firestore-landprep')

const main = async () => {
  const handler = new FirestoreLandprep(path.resolve(__dirname, '02_land_preparation_CSV.csv'))

  try {
    await handler.readCSV()
    console.log('csv read done')
  } catch (err) {
    console.log(err.message)
  }

  if (handler.data()) {
    try {
      // Upload/write data
      const data = handler.data()

      await Promise.all([
        handler.firestoreUpload('cr_landpreps', true, data.landprep_list),
        handler.firestoreUpload('cr_landpreps_recommendations', true, data.recommendations_list)
      ])

      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
