import eel
from datetime import datetime
from loggingoutput import writeToLog

eel.init('web')

logfile = 'log.txt'

## @eel.expose makes the following function visible in JS
## Applying the same concept before a JS function will make the JS function visible in Python
@eel.expose
def test_server_function(name):
    """ Tests connection with the JS receiver, printing the current date and a message """
    writeToLog("Server up with name " + name, logfile)
    return "Server is running ... " + str(datetime.now())

eel.start("index.html")

## Retrieving input list from JS ##
def getInputList():
    writeToLog("Got input" + inputs, logfile)

@eel.expose
def pythonReceiver():
    """ Receives the inputs """
    global inputs 
    inputs = eel.getInputPython()(getInputList)
    return inputs

## Predict Methodology ##
from sklearn import linear_model
import pandas as pd

data = pd.read_csv("/Dataset/pythstats.csv")
writeToLog(data, logfile)



