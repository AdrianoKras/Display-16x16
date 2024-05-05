#include <Adafruit_NeoPixel.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <zlib.h>
#include <string.h>
#define PIN 4
#define NUMPIXELS 256
#define DELAYVAL 500



DynamicJsonDocument doc(20567);
ESP8266WebServer server(80);

gzFile tescik;

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

const char* ssid = "Szybdzior";
const char* password = "Kochamkota1";
double brightness = 1;


struct ColorPix {
  int r;
  int g;
  int b;
};
ColorPix leduchy[256];
void setup() {
  pinMode(2, OUTPUT);
  Serial.begin(115200);
  WiFi.begin(ssid, password);  //Connect to the WiFi network

  while (WiFi.status() != WL_CONNECTED) {  //Wait for connection

    delay(500);
    Serial.println("Waiting to connect...");
  }

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //Print the local IP
  server.enableCORS(true);    

  server.on("/pixels", handlePhoto);  //Associate the handler function to the path
  server.on("/gif", handleGif);
  server.on("/onoff", handleOnOff);
  server.on("/bright",handleBright);
  server.begin();  //Start the server
  Serial.println("Server listening");
  for(int i = 0; i<3; i++) {
      digitalWrite(2, HIGH);
    delay(500);
    digitalWrite(2, LOW);
    delay(500);
  }
  pixels.begin();
}

void loop() {
  server.handleClient();
}
void onLedy() {
  pixels.clear();
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.gamma32(pixels.Color((leduchy[i].r * brightness), (leduchy[i].g * brightness), (leduchy[i].b * brightness))));
  }
  pixels.show();
}
void handleOnOff() {
  if(server.hasArg("plain") == false) {
    server.send(200,"text/plain", "Nothing");
  }
  Serial.println(server.arg("plain"));
  String onOff = server.arg("plain");
  
  if(onOff == "true") {
    pixels.clear();
  }else {
    onLedy();
  }
  server.send(200,"text/plain","Supi");
}
void handleBright() {
  if(server.hasArg("plain") == false) {
    server.send(200,"text/plain", "Nothing");
  }
  String del = server.arg("plain");
  int bright = del.toInt();
  Serial.println(bright);
  pixels.setBrightness(bright);
  pixels.show();
  server.send(200,"text/plain", "Nothing");
}
void handleGif() {
  if(server.hasArg("plain") == false) {
    Serial.println("Brak");
    server.send(200, "text/plain", "Where is body");
    return;
  }
  Serial.println("jest gif");
  delay(500);
  deserializeJson(doc, server.arg("plain"));
  int test = doc[0][0]["r"];


  Serial.println(server.arg("plain"));
  server.send(200, "text/plain", "WOOOW");
   
}

void handlePhoto() {  //Handler for the body path
  if (server.hasArg("plain") == false) {  //Check if body received
    Serial.println("Brak danych");
    server.send(200, "text/plain", "Body not received");
    return;
  }
  Serial.println("jest cos");
  delay(500);
  deserializeJson(doc, server.arg("plain"));
  int id = 0;
  int secondCircle = 0;
  int thirdCircle = 0;
  int fourthCircle = 1;
  int fifthCircle = -1;
  int circle = 0;
  for (int i = 0; i < NUMPIXELS; i++) {
    if(id == 16) {
          id = 0;
          secondCircle = secondCircle - 16;
          fourthCircle = 1;
          fifthCircle = -1;
          circle++;
    }      
    int realid = secondCircle*16 + circle;
    if(id % 2 != 0) {
      
      if(circle == 0) {
        realid = 31*fourthCircle + thirdCircle;
        thirdCircle++;
        fourthCircle++;
      }else {
        int ex = (circle - 1);
        realid = 31*fourthCircle + fifthCircle - ex ;
        fourthCircle++;
        fifthCircle++;
      }
      
    }
    leduchy[realid].r = doc[i]["r"];
    leduchy[realid].g = doc[i]["g"];
    leduchy[realid].b = doc[i]["b"];
    
    id++;
    secondCircle++;
  }
  Serial.println(leduchy[0].g);
  onLedy();
  server.send(200, "text/plain", "WOOOW");
  
}
