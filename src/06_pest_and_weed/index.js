const path = require('path')
const FirestoreWaterMgt = require('./firestore-water')

const main = async () => {
  const handler = new FirestoreWaterMgt(path.resolve(__dirname, '06_pest_and_weed.csv'))

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
        handler.firestoreUpload('cr_pestweed_mgt', true, data.pest_weed_mgt_list),
        handler.firestoreUpload('cr_pestweed_mgt_recommendations', true, data.recommendations_list),
      ])
  
      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
