import socket

sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_STRAM)
sock.bind(("127.0.0.1", socket.htonl(12345)))

socket.listen()
client = socket.accept()

while True:
    data = client.recv(512).decode("utf-8")
    print(data)
    client.send(b"Thank you")
