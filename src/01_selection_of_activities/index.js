const path = require('path')
const FirestoreActivities = require('./firestore-activities')

const main = async () => {
  const firestoreActivities = new FirestoreActivities(path.resolve(__dirname, '01_selection_of_varieties_CSV.csv'))

  try {
    await firestoreActivities.readCSV()
    console.log('done')
  } catch (err) {
    console.log(err.message)
  }

  if (firestoreActivities.data()) {
    try {
      // Upload/write data
      const data = firestoreActivities.data()

      await Promise.all([
        firestoreActivities.firestoreUpload('cr_sel_varieties', true, data.varieties_list),
        firestoreActivities.firestoreUpload('cr_sel_varieties_recommendations', true, data.recommendations_list),
        firestoreActivities.firestoreUpload('cr_sel_varieties_provinces', true, data.province_list)
      ])

      console.log('data uploaded!')
    } catch (err) {
      console.error(err.message)
    }
  }
}

main()
