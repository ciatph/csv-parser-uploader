require('dotenv').config()
const path = require('path')
const { FirestoreData, CsvToFireStore } = require('csv-firestore')

const main = async () => {
  const Firestore = new FirestoreData()
  const assets = new CsvToFireStore(path.resolve(__dirname, 'assets_dev.csv'))

  try {
    await assets.readCSV()
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  const jsonData = {
    description: 'Opengraph image URL links',
    data: assets.data()
  }

  try {
    const docRef = await Firestore.db
      .collection('n_page_assets')
      .doc('opengraph')
      .set(jsonData)
    console.log(docRef)
  } catch (err) {
    console.log(err.message)
  }
}

main()
