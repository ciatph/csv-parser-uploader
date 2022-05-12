const path = require('path')
const FirestoreMethodPlanting = require('./firestore-planting')

const main = async () => {
  const handler = new FirestoreMethodPlanting(path.resolve(__dirname, '03_method_of_planting.csv'))

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
        handler.firestoreUpload('cr_planting_methods', true, data.planting_methods_list),
        handler.firestoreUpload('cr_planting_methods_recommendations', true, data.recommendations_list)
      ])

      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
