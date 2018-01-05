/sbin/ifconfig
/usr/bin/java -Dport=5000 -Djava.security.egd=file:/dev/urandom -jar ./jarlib/thrust.jar ./app/server.js > server.log  2>&1  &
exit 0
