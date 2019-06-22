const firebaseConfig = {
  apiKey: "AIzaSyD0WfWeJt_-_BpQzm0km0SspnTpGvvvo3o",
  authDomain: "train-scheduler-4c2ff.firebaseapp.com",
  databaseURL: "https://train-scheduler-4c2ff.firebaseio.com",
  projectId: "train-scheduler-4c2ff",
  storageBucket: "train-scheduler-4c2ff.appspot.com",
  messagingSenderId: "591127548202",
  appId: "1:591127548202:web:0c1d77456fbabf21",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const { format } = dateFns;
const createEl = el => document.createElement(el);
const select = id => document.getElementById(id);

const setEl = (text) => {
  const element = createEl("td");
  element.innerHTML = text;
  return element;
};

const createEntry = (event) => {
  event.preventDefault();
  const trainName = select("name").value;
  const dest = select("destination").value;
  const freq = select("frequency").value;
  const trainTime = select("trainTime").value;
  const newTrain = {
    name: trainName,
    destination: dest,
    frequency: freq,
    nextArrival: trainTime,
    minutesAway: trainName,
  };
  database.ref().push(newTrain);
  select("form").reset();
};

database.ref().on("child_added", (snapshot) => {
  const row = createEl("tr");
  const name = setEl(snapshot.val().name);
  const dest = setEl(snapshot.val().destination);
  const freq = setEl(snapshot.val().frequency);
  const arrive = setEl(snapshot.val().nextArrival);
  const minAway = setEl(snapshot.val().minutesAway);
  console.log(name, dest, freq);
  row.append(name, dest, freq, arrive, minAway);
  select("tbody").append(row);
});

select("form").addEventListener("submit", createEntry);

// console.log(trainName);
