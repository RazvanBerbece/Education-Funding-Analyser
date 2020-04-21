## Some helper libraries used for smaller tasks ##
import eel
from datetime import datetime
from loggingoutput import writeToLog

## Predict Methodology ##
from sklearn import linear_model
import pandas as pd

logfile = 'log.txt'
inputs = []

## @eel.expose makes the following function visible in JS
## Applying the same concept before a JS function will make the JS function visible in Python
@eel.expose
def test_server_function(name):
    """ Tests connection with the JS receiver, printing the current date and a message """
    writeToLog("Server up with name " + name, logfile)
    return "Server is running ... " + str(datetime.now())

def printInput(input):
    """ Prints and saves the received input in the inputs list """
    writeToLog("Got input: " + str(input), logfile)
    inputs = input
    print(inputs)

## Retrieving input list from JS ##
@eel.expose
def getInputList():
    """ Gets the input list fro, the JS side, and prints using a callback function """
    writeToLog("Called getInputList() in Python ...", logfile)
    inputs = eel.logPythonInput()(printInput)

def main():
    data = pd.read_csv("Dataset/pythstats.csv")
    print(data)

if __name__ == "__main__":
    main()
    eel.init('web')
    eel.start("index.html")


