## Some helper libraries used for smaller tasks ##
import eel
from datetime import datetime
from loggingoutput import writeToLog

## Predict Methodology ##
from sklearn import linear_model
import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

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
    """ Gets the input list from the JS side, and prints using a callback function """
    writeToLog("Called getInputList() in Python ...", logfile)
    inputs = eel.logPythonInput()(printInput)

def assessModel(regressor, predictors, predicted):
    """ Assesses the efficiency of the calculated model """
    #To retrieve the intercept:
    print(regressor.intercept_)
    #For retrieving the slope:
    print(regressor.coef_)
    print(regressor.score(predictors, predicted))
    writeToLog("Current score for LR : " + str(regressor.score(predictors, predicted)), logfile)

def modelSummary(dataset):
    """ Prints the model's summary table """
    X = np.column_stack((dataset['govFunds'], dataset['primaryEnroll']))
    y = dataset['illiteracyNo']
    X2 = sm.add_constant(X)
    est = sm.OLS(y, X2)
    est2 = est.fit()
    print(est2.summary())

def main():
    
    ## Loading the CSV file which has the Education Statistics ##
    dataset = pd.read_csv("Dataset/pythstats.csv")
    print(dataset)

    Xm = dataset.drop(['country', 'illiteracyNo'], axis=1)
    y = dataset['illiteracyNo'].values.reshape(-1,1)

    ## Spliting the dataset into Training set and Test Set ##
    x_train, x_test, y_train, y_test = train_test_split(Xm, y, test_size= 0.2, random_state=0)

    ## Training the model ##
    regressor = LinearRegression()
    regressor.fit(x_train, y_train)

    ## Assessing the model ##
    modelSummary(dataset)
    assessModel(regressor, Xm, y)   

if __name__ == "__main__":
    main()
    eel.init('web')
    eel.start("index.html")


