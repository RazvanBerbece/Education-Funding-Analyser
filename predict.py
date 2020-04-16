import eel
from datetime import datetime

eel.init('web')

@eel.expose
def test_server_function(name):
    print(name)
    return "Server functional..." + datetime.today().strftime('%Y-%m-%d')

eel.start("index.html")
