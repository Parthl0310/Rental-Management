import React from 'react'
import ProductDetail from '../Components/Product/ProductDetail'

const Home = () => {
  const product={
  "_id": {
    "$oid": "6a280204d7491787faadca23"
  },
  "name": "Printer",
  "description": " HP",
  "category": "Electronics",
  "colors": [
    "black",
    "silver"
  ],
  "images": [
    "http://res.cloudinary.com/didtiqh5a/image/upload/v1781006848/vcmjbxtjjgw81iyhmpu0.jpg",
    "http://res.cloudinary.com/didtiqh5a/image/upload/v1781006849/qcjf839tnmftdvzzmjps.jpg",
    "http://res.cloudinary.com/didtiqh5a/image/upload/v1781006850/m3smakof6wwvhqvwflgv.jpg"
  ],
  "totalStock": 1,
  "availableStock": 1,
  "pricing": {
    "perHour": 100,
    "perDay": 200,
    "perWeek": 3000,
    "perMonth": 10000,
    "_id": {
      "$oid": "6a280204d7491787faadca24"
    }
  },
  "extraHourCharge": 0,
  "extraDayCharge": 0,
  "depositAmount": 2000,
  "lateFeePerDay": 0,
  "taxPercent": 18,
  "isAvailable": true,
  "averageRating": 0,
  "totalReviews": 0,
  "createdAt": {
    "$date": "2026-06-09T12:07:32.066Z"
  },
  "updatedAt": {
    "$date": "2026-06-09T12:07:32.066Z"
  },
  "__v": 0
}
  return (
    <>
      <ProductDetail/>      
    </>

  )
}

export default Home