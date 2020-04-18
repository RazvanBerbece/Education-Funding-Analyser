/** Checks if an input text contains only digits.
 *  Used to sanitise the textareas for the prediction params.
 * 
 *  Return TRUE if the input can be parsed as a float and if it is begger than 0.
 */
function checkInputAllDigits(input) {
    var value = parseFloat(input);

    if (value == NaN) return 0;

    if (value <= 0) return 0;

    return value;
}

/** Checks if the input is a valid country code
 *  Because the textarea has a constraint of 3 letters, we don't have to check the length.
 * 
 *  Return TRUE if all characters of the input are alphabetic.
 */
function checkInputCountryCode(code) {
    if (code.length != 3) return false;
    for (i = 0; i < code.length; i++) {
        if (!(typeof code[i] === "string" && code[i].length === 1 && /[A-Z]/.test(code[i]))) {
            return false;
        }
    }
    return true;
}