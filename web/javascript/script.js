/* -------------- VARIABLES AND DEFAULTS INITS -------------- */

var desc_text = document.getElementById('HomeText');
var pages = document.getElementsByClassName('page');

var jqhome = $('#mainPage');
var jqpred = $('#predictPage');
var jqdesc = $('#descriptionPage');

var jqdesc_text = $('#HomeText');

function __init__() {
    jqpred.hide();
    jqdesc.hide();
}

var inputs = []; 
var output = $('#output')

__init__();

/* -------------- TESTING JS - PYTHON FRAMEWORK -------------- */

async function testServerFunctionJS() {
    jqdesc_text.text( await eel.test_server_function("AntBBC")() );
    console.log("Successful !");
}
testServerFunctionJS();

/* -------------- UPDATING WITH THE CURRENT MODEL SCORE -------------- */

async function updateScore() {
    currentScore = $('#modelScore');
    currentScore.text( await eel.getPythonScore()() );
}
updateScore();

/* -------------- FADEIN/FADEOUT PROCESS BETWEEN MENU ITEMS -------------- */

function switchPage(switch_to) {
    // Using comletion handlers so the page divs 
    // don't stack while transitioning leading to GUI glitches
    switch (switch_to) {
        case 0:
            jqdesc.fadeOut(500, function() {
                jqpred.fadeOut(500, function() {
                    jqhome.fadeIn(850);
                });
            });
            break;
        case 1:
            jqdesc.fadeOut(500, function() {
                jqhome.fadeOut(500, function() {
                    jqpred.fadeIn(850);
                });
            });
            break;
        case 2:
            jqhome.fadeOut(500, function() {
                jqpred.fadeOut(500, function() {
                    jqdesc.fadeIn(850);
                });
            });
            break;
    }

}

/* -------------- GETTING DATA FROM INPUT FIELDS -------------- */

var buttonPredict = $('.predict');

async function editOutput(newOutput) {
    toBeInserted = await newOutput;
    output.fadeOut(750, function(){
        output.text( toBeInserted );
    });
    output.fadeIn(1000);
}

async function submitInput() {
    var enrollment = $('.enroll').val();
    var fundsInput = $('.funds').val();
    var GDP = $('.GDP').val();
    var mortality = $('.mortality').val();

    gotFunds = checkInputAllDigits(fundsInput); /* This is the float value of the funds given */
    gotEnrollment = checkInputAllDigits(enrollment); /* This is the float value of the enrollment rate given */
    gotGDP = checkInputAllDigits(GDP);
    gotMortality = checkInputAllDigits(mortality);

    if (gotFunds != 0 && gotEnrollment != 0) {
        console.log(1); /* Successfully got inputs into JS */
        inputs = [gotFunds, gotEnrollment, gotGDP, gotMortality];
        await eel.getInputList()();
        /* GETTING OUTPUT OF MODEL FROM PYTHON SIDE */
        editOutput( eel.getPythonPrediction()() )
    }
    else { /* Will display error alert */
        console.log(0) // Fail
        return -1;
    }
}
buttonPredict.on('click', submitInput);

/* -------------- SENDING INPUT TO BACKEND PYTHON THROUGH EEL -------------- */

eel.expose(logPythonInput);
function logPythonInput() { /* This will send the input list  */
    console.log(inputs);
    return inputs;
}
