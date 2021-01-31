import { expect } from 'chai'
import moment = require('moment')
import * as supertest from 'supertest'
import { CreateRestaurant } from '../../../../src/server/restaurants/model'
import { truncateTables } from '../../database-utils'
import {
  createRestaurantTest,
  createUserTest,
  getLoginToken,
  testServer
} from '../../server-utils'
const testDates = new Date('2021-01-31')
const restaurants = {
  restaurants: [
    {
      blurhash: 'UKFGw4^KM}$$x@X8N1kB10R+xEWWR8Rlt4o0',
      launch_date: '2020-02-23',
      location: [24.941244, 60.171987],
      name: 'Ketchup XL',
      online: false,
      popularity: 0.30706741877410304
    },
    {
      blurhash: 'UCO;.s:bO%r_yWXlORbbC?TFvobaVDi_t9nS',
      launch_date: '2020-02-19',
      location: [24.935637, 60.156621],
      name: 'Tender Lettuce',
      online: true,
      popularity: 0.3919633748546864
    },
    {
      blurhash: 'UH9DE2+hKKsCO-X5r]n*3#GAw3Sx+hr]OnX5',
      launch_date: '2020-05-22',
      location: [24.935326, 60.155631],
      name: 'Mustard',
      online: true,
      popularity: 0.40907452479616846
    },
    {
      blurhash: 'UME,}O}zIwJXTsTGnjs*I{OHbYsRMoi~xnbI',
      launch_date: '2020-11-11',
      location: [24.9487, 60.172542],
      name: 'Relish Place',
      online: false,
      popularity: 0.6696615083382598
    },
    {
      blurhash: 'UGHdYc]|EmNdYjJW$doe57J7bcxZ8$xBbYW-',
      launch_date: '2020-03-16',
      location: [24.931176, 60.166673],
      name: 'Heavenly Crackers House',
      online: true,
      popularity: 0.17347340947833162
    },
    {
      blurhash: 'UJG7Y{^8W-Io%yIpa#s:5hOks:sE8zxabYf~',
      launch_date: '2020-09-21',
      location: [24.94437, 60.166527],
      name: 'Awesome Olive Van',
      online: false,
      popularity: 0.5612382661825036
    },
    {
      blurhash: 'UJAw_5[.OEW;2vJ-#,a}ODJ-OEwc,VwcSgSg',
      launch_date: '2020-01-25',
      location: [24.927635, 60.160208],
      name: 'Potato Garden',
      online: false,
      popularity: 0.9385898095797295
    },
    {
      blurhash: 'UCRSO~%MR5XlqDX+eUs;RQWCkCoeh#idkqWB',
      launch_date: '2020-03-23',
      location: [24.932231, 60.159385],
      name: 'Horrific Taco Hotel',
      online: true,
      popularity: 0.3344814415485037
    },
    {
      blurhash: 'UCOAiQ%fIVxt8zRRx@V[F-Scj0WU-qoeWBof',
      launch_date: '2020-07-19',
      location: [24.949887, 60.164144],
      name: 'Ketchup Garden',
      online: true,
      popularity: 0.13868764972681744
    },
    {
      blurhash: 'UNDLy=}iEmRqT1S6nis*7uOnwKW=RDaetKk8',
      launch_date: '2020-04-15',
      location: [24.931383, 60.172675],
      name: 'Papas Burger Party',
      online: true,
      popularity: 0.8212304387029502
    },
    {
      blurhash: 'UAIcz{}vxmSuE4ItNMai6=Fns;wi-DxaX2X3',
      launch_date: '2020-01-18',
      location: [24.931684, 60.159661],
      name: 'Tomato Paste',
      online: true,
      popularity: 0.3426788599878831
    },
    {
      blurhash: 'UIGXfS,[oLS1AVJPa{sp1fo2juWV=Ko3WWS2',
      launch_date: '2020-10-15',
      location: [24.930341, 60.167461],
      name: 'Paprika Grill',
      online: true,
      popularity: 0.21829225206482272
    },
    {
      blurhash: 'UFO1ex-ANaRmd1SwwgodH|R-brt5HdsokBWX',
      launch_date: '2020-03-30',
      location: [24.945411, 60.158344],
      name: 'Heavenly Taco Palace',
      online: false,
      popularity: 0.11313881394579015
    },
    {
      blurhash: 'UDSYr*v7X%kVq0cOi%etTca$nibqr4a8bqk7',
      launch_date: '2020-01-05',
      location: [24.930132, 60.152363],
      name: 'Fake Tomato Mafia',
      online: true,
      popularity: 0.7953685298092403
    },
    {
      blurhash: 'U9O[r*?hI_VN*8yNniVx5^NhxTknY]MmX+tx',
      launch_date: '2020-11-23',
      location: [24.935659, 60.161989],
      name: 'Chili powder',
      online: true,
      popularity: 0.7353250033621942
    },
    {
      blurhash: 'UOC~Pw#,JUo0?Rk9n%oc1PS|w]k9DZs,Szba',
      launch_date: '2020-09-06',
      location: [24.932806, 60.160777],
      name: 'Shocking',
      online: true,
      popularity: 0.06954263841889538
    },
    {
      blurhash: 'UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX',
      launch_date: '2020-04-20',
      location: [24.938082, 60.17626],
      name: 'Sea Chain',
      online: true,
      popularity: 0.956990414084132
    },
    {
      blurhash: 'UHJ=+6?ZD+w^GstknPR+4XM}x@a#d=MytRt6',
      launch_date: '2020-06-29',
      location: [24.925349, 60.176609],
      name: 'Happy',
      online: false,
      popularity: 0.41334922328347296
    },
    {
      blurhash: 'UMD*|{}^9sn,K@XgwOj[9aNGxtbYQ;a3tQof',
      launch_date: '2020-10-10',
      location: [24.946103, 60.180464],
      name: 'Papas',
      online: true,
      popularity: 0.32967241195011165
    },
    {
      blurhash: 'UHEVLk~04~-gG6SuxFob5LWZ$]NfI2RWkTai',
      launch_date: '2020-07-07',
      location: [24.930746, 60.154788],
      name: 'Mamas Tomato Basket',
      online: true,
      popularity: 0.10851108213709704
    },
    {
      blurhash: 'UKNaZ$xnRXaQO5WEt2f7DfRpo?k8MptKV}ou',
      launch_date: '2020-03-14',
      location: [24.924752, 60.179213],
      name: 'Charming Pepper Emporium',
      online: true,
      popularity: 0.741748846018373
    },
    {
      blurhash: 'UDM+S%:dJ{TWUWTtV?v.0_n8oNX3Z|Rit9S]',
      launch_date: '2020-03-03',
      location: [24.94267, 60.159415],
      name: 'Loving Lemons',
      online: true,
      popularity: 0.18821176187284486
    },
    {
      blurhash: 'UGKp#o@uCO#SLwTIrYkBC~X7rsXRduSgb[nP',
      launch_date: '2020-11-24',
      location: [24.950464, 60.170267],
      name: 'Butter Hotel',
      online: true,
      popularity: 0.6251161053931533
    },
    {
      blurhash: 'U3QqKl}:O-m?7rJ*#pkSM9DqNuxq=vxYV^RU',
      launch_date: '2020-09-18',
      location: [24.938181, 60.162044],
      name: 'Sea',
      online: true,
      popularity: 0.4264074321140764
    },
    {
      blurhash: 'U6T69eube;rHy,lNf%a3V5aOkUknu:ZTg1k-',
      launch_date: '2020-09-25',
      location: [24.95136, 60.157142],
      name: 'Rosemary',
      online: false,
      popularity: 0.8514554035262657
    },
    {
      blurhash: 'UHPNdonnSunnGeX3nnbXFWn,bEjc#bf9W-ay',
      launch_date: '2020-02-20',
      location: [24.933601, 60.154959],
      name: 'Honey Extreme',
      online: false,
      popularity: 0.1887706331565543
    },
    {
      blurhash: 'U5RVux+zIok,tUNGxZjHGjTvaMwOMHxbb^b]',
      launch_date: '2020-05-14',
      location: [24.932251, 60.1816],
      name: 'Soda Factory',
      online: false,
      popularity: 0.5942131535084464
    },
    {
      blurhash: 'UJFh9i~A9btLO7bXxHs.AAJ5s:spI1jJo@R*',
      launch_date: '2020-02-14',
      location: [24.925993, 60.171116],
      name: 'Cake Heaven',
      online: false,
      popularity: 0.698384415286917
    },
    {
      blurhash: 'UCN8K6?TIZjGPUR-xWW;8%IbtOxrHat3WYa#',
      launch_date: '2020-07-28',
      location: [24.950922, 60.154714],
      name: 'Extreme',
      online: true,
      popularity: 0.6459340832349247
    },
    {
      blurhash: 'UI97ru%EIvocNMa#t2oc0YIvxnR.-hocIvWF',
      launch_date: '2020-01-20',
      location: [24.938353, 60.172132],
      name: 'Chili Pepper',
      online: true,
      popularity: 0.8934866288893477
    },
    {
      blurhash: 'UKJ]2:tRJ5kV%gs;V@sW3|njn,n+U_R%ozSx',
      launch_date: '2020-04-24',
      location: [24.930713, 60.162698],
      name: 'Horrific Salami',
      online: true,
      popularity: 0.08895510522751925
    },
    {
      blurhash: 'UMD*~9$$azNK9}I@jts-12xEoKaz=wodS3R,',
      launch_date: '2020-01-06',
      location: [24.942542, 60.181301],
      name: 'Black Pepper Grill',
      online: false,
      popularity: 0.5359213679339973
    },
    {
      blurhash: 'UKGsRwwbSis92|Sis8W=6.WrW=js;cjZWra}',
      launch_date: '2020-03-20',
      location: [24.922566, 60.162293],
      name: 'Cheese Buffet',
      online: true,
      popularity: 0.34380242340441275
    },
    {
      blurhash: 'UHJZf_}jIcNfK}THnQnjElN_kSs+Q^eYtLbr',
      launch_date: '2020-07-24',
      location: [24.944815, 60.174204],
      name: 'Yucky Fish Buffet',
      online: false,
      popularity: 0.06909726749813876
    },
    {
      blurhash: 'UBP^%T-rNVeoI9M{t8ozKVX1rzWA$-ozX2kB',
      launch_date: '2020-12-07',
      location: [24.929344, 60.162536],
      name: 'Tortilla Place',
      online: true,
      popularity: 0.2389385356741786
    },
    {
      blurhash: 'U8TRlmmRf6pHtRg2f6e.hdh0fkeTrXeTfkgM',
      launch_date: '2020-03-11',
      location: [24.94357, 60.152337],
      name: 'Cauliflower',
      online: false,
      popularity: 0.5388780132210966
    },
    {
      blurhash: 'UEL:h[|8I-OkYxTsn9r_ExOlo{s:M1eCxvkV',
      launch_date: '2020-12-08',
      location: [24.938667, 60.155196],
      name: 'Corn Place',
      online: false,
      popularity: 0.5436221040194886
    },
    {
      blurhash: 'UCPYm;+UJytLYlTBrgk9KrTSoLnUMDnUk$Sc',
      launch_date: '2020-08-30',
      location: [24.93467, 60.175518],
      name: 'Ultimate',
      online: false,
      popularity: 0.08156904470685529
    }
  ]
}

describe('GET /api/v1/restaurants/?lat=<latitude>&lon=<longitude>', () => {
  let token: string

  before(async () => {
    await truncateTables(['restaurant', 'user'])

    const user = {
      email: 'dude@gmail.com',
      firstName: 'super',
      lastName: 'mocha',
      password: 'secret'
    }

    await createUserTest(user)
    token = await getLoginToken('dude@gmail.com', 'secret')
  })

  it('Should return 400 when "lon" argument is missing from link', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"lon" is required')
  })
  it('Should return 400 when "lat" argument is missing from link', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lon=60.1709')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"lat" is required')
  })
  it('Should return 400 when "lon" and "lat" arguments are missing from link', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(2)
    expect(res.body.fields[0].message).eql('"lat" is required')
    expect(res.body.fields[1].message).eql('"lon" is required')
  })
  it('Should return 400 when "lon" is not a number', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=text')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"lon" must be a number')
  })
  it('Should return 400 when "lat" is not a number', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lon=60.1709&lat=text')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(1)
    expect(res.body.fields[0].message).eql('"lat" must be a number')
  })
  it('Should return 400 when "lat" and "lon" are not numbers', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=text&lon=text')
      .set('Authorization', token)
      .expect(400)
    expect(res.body.code).equals(30001)
    expect(res.body.fields.length).equals(2)
    expect(res.body.fields[0].message).eql('"lat" must be a number')
    expect(res.body.fields[1].message).eql('"lon" must be a number')
  })
  it('Should return 200 when "lat" and "lon" are provided and in the correct format', async () => {
    await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=10&lon=10')
      .set('Authorization', token)
      .expect(200)
  })
  it('Should return 200 and an empty sections list because no restaurants available', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=10&lon=10')
      .set('Authorization', token)
      .expect(200)
    expect(res.body.sections.length).equals(0)
  })
  it('Should return 200 and an empty sections list because no restaurants match (test for radius condition)', async () => {
    for await (const restaurant of restaurants.restaurants) {
      createRestaurantTest(restaurant as CreateRestaurant, token)
    }
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=10&lon=10')
      .set('Authorization', token)
      .expect(200)
    expect(res.body.sections.length).equals(0)
  })
  it('Should return unauthorized when token is not valid', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=24.941')
      .set('Authorization', 'wrong token')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
  it('Should return unauthorized when token is missing', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=24.941')
      .expect(401)

    expect(res.body.code).equals(30002)
  })
})

describe('GET /api/v1/restaurants/?lat=<latitude>&lon=<longitude> Query test', () => {
  let token: string

  before(async () => {
    await truncateTables(['restaurant', 'user'])

    const user = {
      email: 'dude@gmail.com',
      firstName: 'super',
      lastName: 'mocha',
      password: 'secret'
    }

    await createUserTest(user)
    token = await getLoginToken('dude@gmail.com', 'secret')

    const currentDate = new Date()

    for await (const restaurant of restaurants.restaurants) {
      const restaurantDate = new Date(restaurant.launch_date)
      restaurant.launch_date = moment(
        new Date(
          restaurantDate.valueOf() + currentDate.valueOf() - testDates.valueOf()
        )
      ).format('YYYY-MM-DD')
      createRestaurantTest(restaurant as CreateRestaurant, token)
    }
  })
  it('Should return 200 and a filled sections list because the restaurants match (test for popular restaurants queries)', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=24.941')
      .set('Authorization', token)
      .expect(200)
    expect(res.body.sections[0].title).equals('Popular Restaurants')
    expect(res.body.sections[0].restaurants.length).equals(10)
    expect(res.body.sections[0].restaurants[0].name).equals('Sea Chain')
    expect(res.body.sections[0].restaurants[1].name).equals('Chili Pepper')
    expect(res.body.sections[0].restaurants[2].name).equals(
      'Papas Burger Party'
    )
    expect(res.body.sections[0].restaurants[3].name).equals(
      'Charming Pepper Emporium'
    )
    expect(res.body.sections[0].restaurants[4].name).equals('Chili powder')
    expect(res.body.sections[0].restaurants[5].name).equals('Butter Hotel')
    expect(res.body.sections[0].restaurants[6].name).equals('Sea')
    expect(res.body.sections[0].restaurants[7].name).equals('Cheese Buffet')
    expect(res.body.sections[0].restaurants[8].name).equals('Tomato Paste')
    expect(res.body.sections[0].restaurants[9].name).equals(
      'Horrific Taco Hotel'
    )
  })
  it('Should return 200 and a filled sections list because the restaurants match (test for new restaurants queries)', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=24.941')
      .set('Authorization', token)
      .expect(200)
    expect(res.body.sections[1].title).equals('New Restaurants')
    expect(res.body.sections[1].restaurants.length).equals(6)
    expect(res.body.sections[1].restaurants[0].name).equals('Tortilla Place')
    expect(res.body.sections[1].restaurants[1].name).equals('Butter Hotel')
    expect(res.body.sections[1].restaurants[2].name).equals('Chili powder')
    expect(res.body.sections[1].restaurants[3].name).equals('Paprika Grill')
    expect(res.body.sections[1].restaurants[4].name).equals('Papas')
    expect(res.body.sections[1].restaurants[5].name).equals('Relish Place')
  })
  it('Should return 200 and a filled sections list because the restaurants match (test for nearby restaurants queries)', async () => {
    const res = await supertest(testServer)
      .get('/api/v1/restaurants/discovery?lat=60.1709&lon=24.941')
      .set('Authorization', token)
      .expect(200)
    expect(res.body.sections[2].title).equals('Nearby Restaurants')
    expect(res.body.sections[2].restaurants.length).equals(10)
    expect(res.body.sections[2].restaurants[0].name).equals('Chili Pepper')
    expect(res.body.sections[2].restaurants[1].name).equals('Butter Hotel')
    expect(res.body.sections[2].restaurants[2].name).equals(
      'Papas Burger Party'
    )
    expect(res.body.sections[2].restaurants[3].name).equals('Sea Chain')
    expect(res.body.sections[2].restaurants[4].name).equals('Paprika Grill')
    expect(res.body.sections[2].restaurants[5].name).equals(
      'Heavenly Crackers House'
    )
    expect(res.body.sections[2].restaurants[6].name).equals('Ketchup Garden')
    expect(res.body.sections[2].restaurants[7].name).equals('Sea')
    expect(res.body.sections[2].restaurants[8].name).equals('Chili powder')
    expect(res.body.sections[2].restaurants[9].name).equals('Horrific Salami')
  })
})
