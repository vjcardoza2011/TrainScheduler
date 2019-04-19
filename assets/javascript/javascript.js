$(document).ready(function(){
 
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCyHYnq0q32_bzr9sXnpSVeSEbuNDnObcc",
    authDomain: "trainscheduler-68b1c.firebaseapp.com",
    databaseURL: "https://trainscheduler-68b1c.firebaseio.com",
    projectId: "trainscheduler-68b1c",
    storageBucket: "trainscheduler-68b1c.appspot.com",
    messagingSenderId: "236796694525"
  };
  firebase.initializeApp(config);

    // Variable references the database
    var database = firebase.database();

    // Variables for the onClick event
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        // Storing and retreiving new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Pushing to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minAway;
       
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
       
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
      
        var minAway = childSnapshot.val().frequency - remainder;
       
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
     
        $("#name-display").html(snapshot.val().name);
        $("#email-display").html(snapshot.val().email);
        $("#age-display").html(snapshot.val().age);
        $("#comment-display").html(snapshot.val().comment);
    });
});