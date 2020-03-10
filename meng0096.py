#!/usr/bin/env python3
# See https://docs.python.org/3.2/library/socket.html
# for a decscription of python socket and its parameters
import socket
import os.path
import requests 
import stat
import sys
import urllib.parse
from os import path
from threading import Thread
from argparse import ArgumentParser
#if x_HTTP[0:4] == "HTTP":
BUFSIZE = 4096
#add the following
CRLF = '\r\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405 METHOD NOT ALLOWED{}Allow: GET, HEAD, POST {}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
NOT_ACCEPTED = 'HTTP/1.1 406 NOT ACCEPTABLE{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
OK = 'HTTP/1.1 200 OK{}{}{}'.format(CRLF, CRLF, CRLF)
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection:close{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection:close{}{}'.format(CRLF, CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}Location:https://www.youtube.com/{}Connection: close{}'.format(CRLF, CRLF,CRLF, CRLF) # do I want to change the link?

def get_contents(fname, code):
    if code == 1:
        with open(fname, 'r') as f:
            return f.read()
    elif code == 2:
        with open(fname, 'rb') as f:
            return f.read()
def check_perms(resource):
    """Returns True if resource has read permissions set on'others'"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0
def client_talk(client_sock, client_addr):
    print('talking to {}'.format(client_addr))
    data = client_sock.recv(BUFSIZE)
    while data:
        print(data.decode('utf-8'))
        data = client_sock.recv(BUFSIZE)
    # clean up
    client_sock.shutdown(1)
    client_sock.close()
    print('connection closed.')
class HTTP_HeadServer:
  def __init__(self, host, port):
    print('listening on port {}'.format(port))
    self.host = host
    self.port = port
    self.setup_socket()

    self.accept()

    self.sock.shutdown()
    self.sock.close()

  def setup_socket(self):
    self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.sock.bind((self.host, self.port))
    self.sock.listen(128)

  def accept(self):
    while True:
        (client, address) = self.sock.accept()
        th = Thread(target=self.accept_request, args=(client, address))
        th.start()
      
  def accept_request(self, client_sock, client_addr):
    print("accept request")
    data = client_sock.recv(BUFSIZE)
    req = data.decode('utf-8') #returns a string with http request
    response=self.process_request(req) #ret string with http response
    client_sock.send(response)
  
  def findParameter (self, name, paramLine) :
    position = paramLine.find(name)
    value = ((paramLine[position:].split('&')[0]))
    value = value.split('=')[1]
    return value
  def process_request(self, request):
    print('######\nREQUEST:\n{}######'.format(request))
    linelist = request.strip().split(CRLF)
    reqline = linelist[0] #get the request line
    rlwords = reqline.split() # get list of strings on request line
    if len(rlwords) == 0:
        return bytes('', 'utf-8')
    if rlwords[0] == 'HEAD':
        resource = rlwords[1][1:] # skip beginning /
        return bytes(self.head_request(resource), 'utf-8')
    elif rlwords[0] == 'GET' :
        resource = rlwords[1][1:] # Gets the name of the file
        test_string = self.head_request(resource)
        if test_string != OK:
            return bytes(test_string, 'utf-8')
        response = ""
        content_type = ""
        file_contents = ""
        if (rlwords[1] == '/mytube') :
           return bytes(MOVED_PERMANENTLY, 'utf-8')
        else :
            if not resource == 'favicon.ico':
                content_length= str(os.path.getsize(resource));
            acceptlist = request.split("Accept: ")
            acceptline = acceptlist[1].split(',')
            acceptline = [w.replace('\r\n', '') for w in acceptline]
            found = False
            for x in range (0, len(acceptlist), 1):
                if '*/*' in acceptlist[x]:
                    found = True
            print(acceptlist[1])
            print(found)
            if (rlwords[1].split('.')[1] == 'html' or rlwords[1].split('.')[1] == 'js') and ('text/html' in acceptline or found == True):
                content_type = "Content-Type: text/html; charset=utf-8"
            elif (rlwords[1].split('.')[1] == 'css') and ('text/css' in acceptline or found == True):
                content_type = "Content-Type: text/css; charset=utf-8"
            elif (rlwords[1].split('.')[1] == 'jpg') and ('image/*' in acceptline or found== True):
                content_type = "Content-Type: image/jpg"
            elif (rlwords[1].split('.')[1] == 'png') and ('image/*' in acceptline or found== True):
                content_type = "Content-Type: image/png"
            elif (rlwords[1].split('.')[1] == 'mp3') and ('audio/*' in acceptline or found== True):
                content_type = "Content-Type: audio/mp3"
            else :
                return bytes(NOT_ACCEPTED[:-2] + "\r\nWrong File Type, not recieved" + NOT_ACCEPTED[-2:], 'utf-8')
            
    # or '*/*' in acceptline :
            if (rlwords[1].split('.')[1] == 'js') or (rlwords[1].split('.')[1] == 'html') or (rlwords[1].split('.')[1] == 'css'):
                file_contents = get_contents(resource, 1)
                content_length = "Content-Length: " + str(len(file_contents))
                response_header = 'HTTP/1.1 200 OK\r\n{} \r\n{}\r\n{}'.format(content_length, content_type, CRLF)
                response = bytes(response_header + file_contents, 'utf-8')
            elif rlwords[1].split('.')[1] == 'mp3' or (rlwords[1].split('.')[1] == 'png') or (rlwords[1].split('.')[1] == 'jpg'):
                file_contents = get_contents(resource, 2)
                content_length = "Content-Length: " + str(len(file_contents))
                response_header = 'HTTP/1.1 200 OK \r\n{}\r\n{}\r\n{}'.format(content_length, content_type, CRLF)
                response = bytes(response_header, 'utf-8') + file_contents
            return response

    elif rlwords[0] == 'POST':
        name = urllib.parse.unquote(self.findParameter('name', linelist[-1]))
        email = urllib.parse.unquote(self.findParameter('email', linelist[-1]))
        address = urllib.parse.unquote(self.findParameter('address', linelist[-1]))
        favplace= urllib.parse.unquote(self.findParameter('place', linelist[-1]))
        URL = urllib.parse.unquote(self.findParameter('url', linelist[-1]))
       
        WebTop = '<!DOCTYPE html><html><body>'
        Table = '<table style="width:100%">'
        Name = '<tr><td>Name</td><td>' + name + '</td>'
        Email = '<tr><td>Email</td><td>' + email+ '</td>'
        Address = '<tr><td>Address</td><td>' + address+ '</td>'
        FavoritePlace ='<tr><td>Favorite PlaceName</td><td>' + favplace+ '</td>'
        URL = '<tr><td>URL</td><td>' + URL + '</td>'
        TableEnd = '</table> </body> </html>'
        
        Response = WebTop + Table + Name + Email + Address + FavoritePlace + URL + TableEnd
        
        content_length = "Content-Length: " + str(len(Response))
        content_type = "Content-Type: text/html; charset=utf-8"
        response_header = 'HTTP/1.1 200 OK \r\n{}\r\n{}\r\n{}'.format(content_length, content_type, CRLF)
        return bytes(response_header+ Response, 'utf-8')
    else: #add ELIF checks for GET and POST before this else..
        return_Message = "\r\n" + METHOD_NOT_ALLOWED[:-2] + "\r\nMethod Not Allowed" + METHOD_NOT_ALLOWED[-2:]
        return bytes(return_Message, 'utf-8')

  def head_request(self, resource):    
    """Handles HEAD requests."""
    if not os.path.exists(resource):
        content_type = "Content-Type: text/html; charset=utf-8"
        file_contents = get_contents("404.html", 1)
        content_length = "Content-Length: " + str(len(file_contents))
        response_header = 'HTTP/1.1 404 NOT FOUND \r\n{}Connection:close \r\n{}\r\n{}'.format(content_length, content_type, CRLF)
        ret = (response_header + file_contents)	
    elif not check_perms(resource):
        content_type = "Content-Type: text/html; charset=utf-8"
        file_contents = get_contents("403.html", 1)
        content_length = "Content-Length: " + str(len(file_contents))
        response_header = 'HTTP/1.1 403 FORBIDDEN \r\n{}Connection:close \r\n{} \r\n{}'.format(content_length, content_type, CRLF)
        ret = (response_header + file_contents)
    else:
        ret = OK
    return ret

def parse_args():
    parser = ArgumentParser()
    parser.add_argument('--host', type=str, required = False, default='localhost', help='specify a host to operate on (default: localhost)')
    parser.add_argument('-p', '--port', type=int, required = False, default=9001, help='specify a port to operate on (default: 9001)')
    args = parser.parse_args()
    return (args.host, args.port)


if __name__ == '__main__':
    #(host, port) = parse_args()
    #print(host)
    if len(sys.argv) > 1:
        #  HTTP_HeadServer(host, port)
        HTTP_HeadServer("localhost", int(sys.argv[1]))
    else:
        HTTP_HeadServer("localhost", 9001)


            
