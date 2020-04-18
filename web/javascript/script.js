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

__init__();

/* -------------- TESTING JS - PYTHON FRAMEWORK -------------- */

async function test_server_function_JS() {
    jqdesc_text.text( await eel.test_server_function("AntBBC")() );
    console.log("Successful !");
}
test_server_function_JS();

/* -------------- FADEIN/FADEOUT PROCESS BETWEEN MENU ITEMS -------------- */

function switch_page(switch_to) {
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
var htmlOutput = $('.output'); /* This is used as a standard output in the HTML document */

function submitInput() {
    var countryInput = $('.code').val();
    var fundsInput = $('.funds').val();

    gotFunds = checkInputAllDigits(fundsInput); /* This is the float value of the funds given */

    if (gotFunds != 0 && checkInputCountryCode(countryInput) == true) {
        console.log(1); /* Successfully got inputs into JS */
        inputs = [gotFunds, countryInput];
    }
    else { /* Will display error alert */
        console.log(0) // Fail
        return -1;
    }
}
buttonPredict.click(function() { /* ??? */
    $.when(submitInput()).then(logPythonInput());
});

/* -------------- SENDING INPUT TO BACKEND PYTHON THROUGH EEL -------------- */

async function logPythonInput() { /* This will send the input list  */
    console.log( await eel.pythonReceiver() );
}

eel.expose(getInputPython);
function getInputPython() { /* This will get called in Python */
    return inputs;
}