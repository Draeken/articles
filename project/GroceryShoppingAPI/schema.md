product {
  _id,
  code: product code that help identification,
  quality: discout, premimum...
}
store {
  _id,
  name,
  country (for international store, one document per country. + allow to know the currency)
  availableProducts: [
    { id: product id, price: mean of all local store }
  ],
  unavailableProducts: [
    id
  ]
}
localStore {
  _id,
  name: local store name,
  location: {
    gps: {
      long,
      lat
    },
    openStreetMap: url ?
    gmap: code ?,
    postalAddress
  }
  storeRef: reference to the store representative of all the local stores,
  availableProducts: [
    { id: product id, price }
  ],
  unavailableProducts: [
    id
  ]
}