import eel
from datetime import datetime

eel.init('web')

## @eel.expose makes the following function visible in JS
## Applying the same concept before a JS function will make the JS function visible in Python
@eel.expose
def test_server_function(name):
    """ Tests connection with the JS receiver, printing the current date and a message """
    print(name)
    return "Server is running ... " + str(datetime.now())

eel.start("index.html")

## Retrieving input list from JS ##
def getInputList():
    print(inputs)

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
data.head()




