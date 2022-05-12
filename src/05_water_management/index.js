const path = require('path')
const FirestoreWaterMgt = require('./firestore-water')

const main = async () => {
  const handler = new FirestoreWaterMgt(path.resolve(__dirname, '05_water_management.csv'))

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
        handler.firestoreUpload('cr_water_mgt', true, data.water_mgt_list),
        handler.firestoreUpload('cr_water_mgt_recommendations', true, data.recommendations_list)
      ])

      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
