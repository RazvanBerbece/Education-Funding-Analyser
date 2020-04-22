/** Checks if an input text contains only digits.
 *  Used to sanitise the textareas for the prediction params.
 * 
 *  Return TRUE if the input can be parsed as a float and if it is begger than 0.
 */
function checkInputAllDigits(input) {
    
    if (input.length == 0) return 0

    var value = parseFloat(input);

    if (value == NaN) return 0;

    if (value <= 0) return 0;

    return value;
}