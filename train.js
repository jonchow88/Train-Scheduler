  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCGzQX6tuDOX9DaU7RXw6IMRjpCRIXLxXk",
    authDomain: "train-schedule-e760d.firebaseapp.com",
    databaseURL: "https://train-schedule-e760d.firebaseio.com",
    projectId: "train-schedule-e760d",
    storageBucket: "train-schedule-e760d.appspot.com",
    messagingSenderId: "982739649763"
  };
  firebase.initializeApp(config);

//creating a variable to serve as a reference to the firebase database
var trainData = firebase.database();

//Collect and store form input data into the variables whenever addTrainBtn is clicked.
$("#addTrainBtn").on("click", function(){
    var trainName = $("#trainNameIn").val().trim();
    var destination = $("#destinationIn").val().trim();

    //use moment.js to change it into an actual time variable
    var firstTrain = moment($("#firstTrainIn").val().trim(),"HH:mm").subtract(10,"years").format("X");
    
    var frequency = $("#frequencyIn").val().trim();

    //creating a local temporary variable for holding new train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }
    //Upload train data to Firebase database
    trainData.ref().push(newTrain);

    alert("New Train Added");
    //Clear text boxes
    $("#trainNameIn").val("");
    $("#destinationIn").val("");
    $("#firstTrainIn").val("");
    $("#frequencyIn").val("");

    //Prevent from refreshing the page
    return false;
})

//Collect data from Firebase 
trainData.ref().on("child_added",function(snapshot){
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency;

//use moment js to calculate how much time until the train arrives

    var remaining = moment().diff(moment.unix(firstTrain),"minutes")%frequency;
    var minutes = frequency - remaining;
    var arrival = moment().add(minutes,"m").format("hh:mm A");

    console.log(remaining);
    console.log(minutes);
    console.log(arrival);
     
//use jQuery to display the data from firebase to the div containing the train schedule table

$("#trainTable > tHead").append("<tr><td>"+name+"</td><td>"+destination+"</td><td>"+frequency+"</td><td>"+arrival+"</td><td>"+minutes+"</td></tr>");


})
