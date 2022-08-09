const path = require('path')
const {
  CsvToFireStore,
  FirestoreData
} = require('csv-firestore')

const main = async () => {
  const Firestore = new FirestoreData()
  const municipalities = new CsvToFireStore(path.resolve(__dirname, 'bicol_municipalities.csv'))

  try {
    await municipalities.readCSV()
    console.log('done')
  } catch (err) {
    console.log(err.message)
  }

  if (municipalities.data()) {
    const data = municipalities.data()
    const jsonData = {
      metadata: {
        title: 'Bicol Municipalities by Provinces',
        description: 'List of Bicol municipalities grouped by province',
        source: 'https://data.humdata.org/dataset/cod-ab-phl?',
        file: 'phl_adminboundaries_candidate_exclude_adm3.zip (phl_admbndp_admALL_psa_namria_itos_20200529.shp)',
        date_created: Firestore.admin.firestore.Timestamp.now()
      },
      data
    }

    try {
      const docRef = await Firestore.db
        .collection('municipalities')
        .doc('bicol')
        .set(jsonData)
      console.log(docRef)
    } catch (err) {
      console.log(err.message)
    }
  }
}

main()
