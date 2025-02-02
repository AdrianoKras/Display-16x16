#include <Wifi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#define PIN 25
#define NUMPIXELS 256
// replace with access point
const char *ssid = "Szybdzior";
const char *password = "Kochamkota1";

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

struct ColorPix
{
  int r = 255;
  int g = 255;
  int b = 255;
};
// settings
int maxBright = 255;
int delayVal = 50;
// buffer
ColorPix leduchy[512];
WebServer server(80);
JsonDocument doc;

// manage leds
void onLedy()
{
  pixels.clear();
  for (int i = 0; i < NUMPIXELS; i++)
  {
    pixels.setPixelColor(i, (maxBright * leduchy[i].r / 255), (maxBright * leduchy[i].g / 255), (maxBright * leduchy[i].b / 255));
  }
  pixels.show();
  delay(delayVal);
}

// handle post requests
void handlePost()
{
  if (server.hasArg("plain") == false)
  { // Check if body received
    server.send(200, "text/plain", "Body not received");
    return;
  }
  deserializeJson(doc, server.arg("plain"));
  // itereting buffer
  for (int k = 0; k < 2; k++)
  {
    // segregate data to use on matrix
    int id = 0;
    int secondCircle = 0;
    int thirdCircle = 0;
    int fourthCircle = 1;
    int fifthCircle = -1;
    int circle = 0;
    for (int i = 0; i < NUMPIXELS; i++)
    {
      if (id == 16)
      {
        id = 0;
        secondCircle = secondCircle - 16;
        fourthCircle = 1;
        fifthCircle = -1;
        circle++;
      }
      int realid = secondCircle * 16 + circle;
      if (id % 2 != 0)
      {
        if (circle == 0)
        {
          realid = 31 * fourthCircle + thirdCircle;
          thirdCircle++;
          fourthCircle++;
        }
        else
        {
          int ex = (circle - 1);
          realid = 31 * fourthCircle + fifthCircle - ex;
          fourthCircle++;
          fifthCircle++;
        }
      }
      // re
      int newIndex = i + (k * 256);
      leduchy[realid].r = doc[newIndex]["r"];
      leduchy[realid].g = doc[newIndex]["g"];
      leduchy[realid].b = doc[newIndex]["b"];
      id++;
      secondCircle++;
    }
    onLedy();
  }
  doc.clear();
  server.send(200, "text/plain", "All okay");
}
void setup()
{
  // setup
  doc.clear();
  Serial.begin(9600);
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.on("/pixel", handlePost);
  server.begin();
  server.enableCORS();
  pixels.begin();
}
void loop()
{
  // give time between requests
  delay(50);
  server.handleClient();
}