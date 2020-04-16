/* -------------- TESTING JS - PYTHON FRAMEWORK -------------- */

var desc_text = document.getElementById('HomeText');
var pages = document.getElementsByClassName('page');

var jqhome = $('#mainPage');
var jqpred = $('#predictPage');
var jqdesc = $('#descriptionPage');

var jqdesc_text = $('.pageHeader').children().first();

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
            jqdesc.fadeOut();
            jqpred.fadeOut();
            jqhome.fadeIn(1000);
            break;
        case 1:
            jqdesc.fadeOut();
            jqhome.fadeOut();
            jqpred.fadeIn(1000);
            break;
        case 2:
            jqhome.fadeOut();
            jqpred.fadeOut();
            jqdesc.fadeIn(1000);
            break;
    }

}
