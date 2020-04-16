import eel
from datetime import datetime

eel.init('web')

## Tests connection with the JS receiver, printing the current date
@eel.expose
def test_server_function(name):
    print(name)
    return "Server functional..." + str(datetime.now())

eel.start("index.html")

## Init ends here ##


