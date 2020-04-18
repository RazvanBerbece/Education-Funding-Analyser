from datetime import datetime

## Function that writes a certain operation to a log ('log.txt')
## Used for debugging purposes
def writeToLog(data, file):
    with open(file, 'a') as log:
        log.write(data + " " + str(datetime.now()) + '\n')