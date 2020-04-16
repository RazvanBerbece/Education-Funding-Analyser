/* -------------- TESTING JS - PYTHON FRAMEWORK -------------- */

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
__init__(); // Initialising the hidden pages

async function test_server_function_JS() {
    jqdesc_text.text( await eel.test_server_function("AntBBC")() );
    console.log("Successful !");
}
test_server_function_JS();

function switch_page(switch_to) {
    
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
