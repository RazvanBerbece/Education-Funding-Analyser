/* -------------- VARIABLES AND DEFAULTS INITS -------------- */

var desc_text = document.getElementById('HomeText');
var pages = document.getElementsByClassName('page');

var jqhome = $('#mainPage');
var jqpred = $('#predictPage');
var jqdesc = $('#descriptionPage');
var jqdata = $('#dataPage');

var jqdesc_text = $('#HomeText');

var analysisWarning = $('.predictWarning');
var warningButton = $('.warningButton');
var clickedWarningButton = false;

var csvText = $('#csvData');

function __init__() {
    jqpred.hide();
    jqdesc.hide();
    jqdata.hide();
}

var inputs = []; 
var output = $('#output')

__init__();

/* -------------- PREDICTION WARNING METHODOLOGY -------------- */

function displayWarning() {
    analysisWarning.show();
    document.getElementsByClassName("analysisForm")[0].style.webkitFilter = "blur(5px)";
    document.getElementsByClassName("analysisOutput")[0].style.webkitFilter = "blur(5px)";
}
displayWarning();

function hideWarning() {
    clickedWarningButton = true;
    analysisWarning.fadeOut(750, function() {
        document.getElementsByClassName("analysisForm")[0].style.webkitFilter = "blur(0px)";
        document.getElementsByClassName("analysisOutput")[0].style.webkitFilter = "blur(0px)";
    });
}
warningButton.on('click', hideWarning);

/* -------------- TESTING JS - PYTHON FRAMEWORK -------------- */

async function testServerFunctionJS() {
    jqdesc_text.text( await eel.test_server_function("AntBBC")() );
    console.log("Successful !");
}
testServerFunctionJS();

/* -------------- UPDATING WITH THE CURRENT MODEL SCORE -------------- */

async function updateScore() {
    currentScoreOne = $('#modelScore');
    currentScoreTwo = $('#modelScoreTwo');
    currentScoreOne.text( await eel.getPythonScore()() );
    currentScoreTwo.text( await eel.getPythonScore()() );
}
updateScore();

/* -------------- FADEIN/FADEOUT PROCESS BETWEEN MENU ITEMS -------------- */

function switchPage(switch_to) {
    // Using comletion handlers so the page divs 
    // don't stack while transitioning leading to GUI glitches
    switch (switch_to) {
        case 0:
            jqdesc.fadeOut(222, function() {
                jqpred.fadeOut(222, function() {
                    jqdata.fadeOut(222, function() {
                        jqhome.fadeIn(850);
                    });
                });
            });
            break;
        case 1:
            jqhome.fadeOut(222, function() {
                jqdesc.fadeOut(222, function() {
                    jqdata.fadeOut(222, function() {
                        jqpred.fadeIn(850);
                    });
                });
            });
            break;
        case 2:
            jqhome.fadeOut(222, function() {
                jqpred.fadeOut(222, function() {
                    jqdata.fadeOut(222, function() {
                        jqdesc.fadeIn(850);
                    });
                });
            });
            break;
        case 3:
            jqhome.fadeOut(222, function() {
                jqpred.fadeOut(222, function() {
                    jqdesc.fadeOut(222, function() {
                        jqdata.fadeIn(850);
                    });
                });
            });
            break;
    }

}

/* -------------- GETTING DATA FROM INPUT FIELDS -------------- */

var buttonPredict = $('.predict');

async function editOutput(newOutput) {
    toBeInserted = await newOutput;
    /* CHECKING IF OUTPUT WAS 0, CASE IN WHICH WE WARN THE USER */
    if (toBeInserted[0] == '0') {
        // TODO CUSTOM ALERT
    }
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

    if (gotFunds && gotEnrollment && gotGDP && gotMortality) {
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

/* -------------- GETTING CSV DATA TABLE FROM PYTHON -------------- */

async function getCSV() {
    CSVdata = await eel.returnCSVpython()();
    displayFormattedTable( CSVdata );
}
getCSV();

function displayFormattedTable(tableString) {

    var htmlData = $('#data');

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');

    var wordCounter = 0;
    var lineCounter = 0;
    var stringArray = tableString.split(/(\s+)/);

    for (var i = 0; i < stringArray.length; i++) {

        if (/^\s+$/.test(stringArray[i])) {
            continue;
        }

        if (wordCounter == 6) {
            lineCounter += 1;
        }

        if (wordCounter == 6 || !i) {
            var tr = tbl.insertRow();
            wordCounter = 0;
            continue;
        }

        if (!lineCounter) {
            var td = tr.insertCell();
            td.append( document.createTextNode(stringArray[i]) );
            td.className = 'tableheader';
            td.style.border = '1px solid black';
            td.style.textAlign = 'right';
        }
        else {
            var td = tr.insertCell();
            td.append(document.createTextNode(stringArray[i]));
            td.style.border = '1px solid black';
            td.style.textAlign = 'right';
        }

        wordCounter += 1;
    }
    htmlData.append(tbl);
}
