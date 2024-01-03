import asyncio
import websockets
from websockets.server import serve
from threading import Thread
from os import path 
from django.db import connection
from json import loads
from sys import argv


async def is_server_started():
    try:
        async with websockets.connect('ws://localhost:8080') as websocket:
            return True
    except ConnectionRefusedError:
        return False



async def BroadCastMessage(message):
    for client in list(ConnectedClient.keys()):
        try:
            await client.send(message)
        except Exception as e:
            # print(str(e))
            ConnectedClient.pop(client)


            

async def echo(websocket):
    async for message in websocket:
        try:
            MessageJson = loads(message , strict=False)
            Action = list(MessageJson.keys())[0]
            Value = list(MessageJson.values())[0]
            Usernames = ",".join(ConnectedClient.values())
            await BroadCastMessage('{'+f'"<UpdateOnlineUsers>":"{Usernames}"'+'}')
            if Action == "Join":
                username = await GetUsernameByToken(Value)
                if username == None:
                    return
                ConnectedClient.update({websocket : username})
                Usernames = ",".join(ConnectedClient.values())
                await BroadCastMessage('{'+f'"<UpdateOnlineUsers>":"{Usernames}"'+'}')
            else:
                if Value.strip() == "": return
                message =  Value.replace("<", "&lt;").replace(">", "&gt;").replace("\n", "\\n")
                username = ConnectedClient.get(websocket)
                await BroadCastMessage('{'+f'"{username}":"{message}"'+'}')
                await AddMessageToDb(message,username)
            websocket.recv()
        except Exception as e:
            print(str(e))

def isJson(str):
    try:
        loads(str)
        return False
    except:
        return False

async def main():
    async with serve(echo, "localhost", 8080):
        await asyncio.Future()  # run forever
    


async def GetUsernameByToken(token):
    t = ThreadWithReturnValue(target=lambda: connection.cursor())
    t.start()
    cursor = t.join()
    cursor.execute('''SELECT username FROM AlphaMessanger_member 
                   Where ChatToken = %s ''',[token])
    try:
        return cursor.fetchone()[0] 
    except:
        return None


async def AddMessageToDb(message , username):
    t = ThreadWithReturnValue(target=lambda: connection.cursor())
    t.start()
    cursor = t.join()
    member_id = cursor.execute(f''' SELECT ID FROM AlphaMessanger_member WHERE username = "{username}"; ''').fetchone()[0] 
    cursor.execute(f'''
                    INSERT INTO AlphaMessanger_message  (message,Member_id)
                            VALUES
                        ("{message}",{member_id})
                ''')
    try:
        return cursor.fetchone()[0] 
    except:
        return None
    
class ThreadWithReturnValue(Thread):
    
    def __init__(self, group=None, target=None, name=None,
                 args=(), kwargs={}):
        Thread.__init__(self, group, target, name, args, kwargs)
        self._return = None

    def run(self):
        if self._target is not None:
            self._return = self._target(*self._args,
                                                **self._kwargs)
    def join(self, *args):
        Thread.join(self, *args)
        return self._return



if ('runserver' in argv):
    server_status = asyncio.get_event_loop().run_until_complete(is_server_started())
    if not server_status:
        ConnectedClient = dict()
        Thread(target= lambda :asyncio.run(main())).start()
        print("WebSocket started")


