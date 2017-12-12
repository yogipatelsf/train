// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBsD_oQ7eVUAiaO9oGhe3U7vEHixDCGRKc",
    authDomain: "train-b1787.firebaseapp.com",
    databaseURL: "https://train-b1787.firebaseio.com",
    projectId: "train-b1787",
    storageBucket: "",
    messagingSenderId: "916236574253"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var trainTime = $("#start-input").val();
  var frequency = $("#frequency-input").val().trim();
  frequency = parseInt(frequency);

  var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
  console.log("TIME CONVERTED: " + firstTimeConverted);

  var diffTime = moment.duration(moment().diff(moment(trainTime, "HH:mm")), 'milliseconds').asMinutes();
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var timeRemaining = frequency - (Math.floor(diffTime) % frequency);
  console.log(timeRemaining);

  var nextTrain = moment(diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(trainTime, "HH:mm")).format("HH:mm");
  console.log("ARRIVAL TIME: " + nextTrain);

  var minTilTrain = Math.ceil(moment.duration(moment(diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(trainTime, "HH:mm")).diff(moment()), 'milliseconds').asMinutes());
  console.log("MINUTES TILL TRAIN: " + minTilTrain);

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    startTime: trainTime,
    frequency: frequency,
    nextTrain: nextTrain,
    minTilTrain: minTilTrain,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.startTime);
  console.log(newTrain.frequency);
  console.log(newTrain.nextTrain);
  console.log(newTrain.minTilTrain);
  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var nameTrain = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().startTime;
  var trainFreq = childSnapshot.val().frequency;
  var arrivalTrain = childSnapshot.val().nextTrain;
  var minTrain = childSnapshot.val().minTilTrain;

  // train Info
  console.log(nameTrain);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainFreq);
  console.log(arrivalTrain);
  console.log(minTrain);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + nameTrain + "</td><td>" + trainDest + "</td><td>" +
  trainFreq + "</td><td>" + arrivalTrain + "</td><td>" + minTrain + "</td><td>"); //+ "</td><td>" + nextTrain + "</td><td>" + minTilTrain + "</td><td>");
});


