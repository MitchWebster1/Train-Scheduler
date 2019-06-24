const firebaseConfig = {
  apiKey: 'AIzaSyD0WfWeJt_-_BpQzm0km0SspnTpGvvvo3o',
  authDomain: 'train-scheduler-4c2ff.firebaseapp.com',
  databaseURL: 'https://train-scheduler-4c2ff.firebaseio.com',
  projectId: 'train-scheduler-4c2ff',
  storageBucket: 'train-scheduler-4c2ff.appspot.com',
  messagingSenderId: '591127548202',
  appId: '1:591127548202:web:0c1d77456fbabf21'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const database = firebase.database()
const createEl = el => document.createElement(el)
const select = id => document.getElementById(id)

// creates an element and sets the text to be displayed
const setEl = text => {
  const element = createEl('td')
  element.innerHTML = text
  return element
}

// gathers information from the form fields and creates database entry
const createEntry = event => {
  event.preventDefault()
  const trainName = select('name').value
  const dest = select('destination').value
  const freq = select('frequency').value
  const trainTime = select('trainTime').value
  const newTrain = {
    name: trainName,
    destination: dest,
    frequency: freq,
    firstTrain: trainTime
  }
  database.ref().push(newTrain)
  select('form').reset()
}

// calculates the minutes until the next train
const minutesTillNextTrain = snapshot => {
  const freq = snapshot.val().frequency
  const firstTime = moment(snapshot.val().firstTrain, 'hh:mm').subtract(
    1,
    'years'
  )
  const difference = moment().diff(moment(firstTime), 'minutes')
  const remainder = difference % freq
  const timeTill = freq - remainder
  return timeTill
}

// calculates the arrival time of the next train
const arrival = minAway => moment().add(minAway, 'minutes')

// gathers the table data then appends the row
database.ref().on('child_added', snapshot => {
  const row = createEl('tr')
  const name = setEl(snapshot.val().name)
  const dest = setEl(snapshot.val().destination)
  const freq = setEl(snapshot.val().frequency)
  const timeTill = minutesTillNextTrain(snapshot)
  const arrivalTIme = setEl(arrival(timeTill).format('hh:mm A'))
  const minAway = setEl(timeTill)
  row.append(name, dest, freq, arrivalTIme, minAway)
  select('tbody').append(row)
})

select('form').addEventListener('submit', createEntry)
