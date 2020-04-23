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

logfile = 'log.log'
inputs = []

regressor = LinearRegression()
prediction = ""
score = ""

dataset = ""

## @eel.expose makes the following function visible in JS
## Applying the same concept before a JS function will make the JS function visible in Python
@eel.expose
def test_server_function(name):
    """ Tests connection with the JS receiver, printing the current date and a message """
    writeToLog("Server up with name " + name, logfile)
    return "Server is running ... " + str(datetime.now())

def printInput(inputstring):
    """ Prints and saves the received input in the inputs list """
    writeToLog("Got input: " + str(inputstring), logfile)
    global inputs
    inputs = inputstring
    print(inputs)
    ## MAKE THE PREDICTION CALL AND CHANGE THE GLOBAL VARIABLE WHICH HOLDS IT ##
    global prediction
    prediction = predictOnInput()

## Retrieving input list from JS  ##
@eel.expose
def getInputList():
    """ Gets the input list from the JS side, and prints using a callback function """
    writeToLog("Called getInputList() in Python ...", logfile)
    inputs = eel.logPythonInput()(printInput)

## Linear Regression Methodology ##
def assessModel(regressor, predictors, predicted):
    """ Assesses the efficiency of the calculated model """
    #To retrieve the intercept/constant:
    print("Intercept / Constant : " + str(regressor.intercept_))
    #For retrieving the slope/coefficient:
    print("Coeff. : " + str(regressor.coef_))
    #For retrieving the score of the model (greater means better):
    global score
    score = str("%.2f" % (regressor.score(predictors, predicted) * 100))
    print("Score : " + str(regressor.score(predictors, predicted)))
    writeToLog("Current score for LR : " + str(regressor.score(predictors, predicted)), logfile)

def modelSummary(dataset):
    """ Prints the model's summary table """
    X = np.column_stack((dataset['govFunds'], dataset['primaryEnroll']))
    y = dataset['illiteracyNo']
    X2 = sm.add_constant(X)
    est = sm.OLS(y, X2)
    est2 = est.fit()
    print(est2.summary())

def compareWithOriginals(predictions, originals):
    """ Given the predictions list and the list of original values, 
    it prints them in a readable format for comparison"""
    index = 0
    for i in predictions:
        print(str(i) + "~~~~~~" + str(originals[index]))
        index += 1

## Predicting and sending the output to JS ##
def predictOnInput():
    """ Given the two input arguments, predicts a value for the illiteracy rate, 
    using the Multiple Linear Regression Equation """
    coefficients_ = []
    coefficients_.append(regressor.coef_)
    """
    print(coefficients_[0][0][0]) ## <-- This gets the first coefficient list
    print(coefficients_[0][0][1]) ## <-- This gets the second coefficient list
    """

    ## List that contains the float values of the coefficients
    floatCoeff = []
    floatCoeff.append(float(coefficients_[0][0][0]))
    floatCoeff.append(float(coefficients_[0][0][1]))
    floatCoeff.append(float(coefficients_[0][0][2]))
    floatCoeff.append(float(coefficients_[0][0][3]))

    ## Need to update with current coefficients
    predicted = regressor.intercept_[0] + floatCoeff[0] * inputs[0] + floatCoeff[1] * inputs[1] + floatCoeff[2] * inputs[2] + floatCoeff[3] * inputs[3]
    if predicted < 0:
        predicted = 0.0
    writeToLog("predictOnInput() in predict.py called : " + str("%.2f" % predicted), logfile)

    return str("%.2f" % predicted)

@eel.expose
def getPythonPrediction():
    """ This will be called in the client side and will return the calculated prediction to be outputted """
    global prediction
    writeToLog("getPythonPrediction() in predict.py called : " + prediction, logfile)
    return prediction

@eel.expose
def getPythonScore():
    """ Returns the current model score for display in the Description frame """
    global score
    return score

@eel.expose
def returnCSVpython():
    """ Returns the CSV data table in str format (maintaining CSV look) """
    global dataset
    return str(dataset)

def main():
    
    ## Loading the CSV file which has the Education Statistics ##
    global dataset
    dataset = pd.read_csv("Dataset/pythstats.csv")
    print(str(dataset))

    Xm = dataset.drop(['country', 'illiteracyNo'], axis=1)
    y = dataset['illiteracyNo'].values.reshape(-1,1)

    ## Spliting the dataset into Training set and Test Set ##
    x_train, x_test, y_train, y_test = train_test_split(Xm, y, test_size= 0.2, random_state=0)

    ## Training the model ##
    regressor.fit(x_train, y_train)

    ## Assessing the model ##
    modelSummary(dataset)
    assessModel(regressor, Xm, y)

    ## Checking predicted values against the originals ##
    compareWithOriginals(regressor.predict(Xm), y)

if __name__ == "__main__":
    main()
    eel.init('web')
    eel.start("index.html")


