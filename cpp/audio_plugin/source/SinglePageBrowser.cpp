#include "SinglePageBrowser.h"

//==============================================================================
#if JUCE_ANDROID
// The localhost is available on this address to the emulator
const juce::String SinglePageBrowser::localDevServerAddress = "http://10.0.2.2:3000/";
#else
const juce::String SinglePageBrowser::localDevServerAddress = "http://localhost:5173/";
#endif

const juce::String SinglePageBrowser::fallbackPageHtml = R"(
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>WebGainUnityWeb</title>
    <style type="text/css">
      body {
        background-color: white;
      }
    </style>
  </head>
  <body>
    <h1>WebGainUnityWeb</h1>
    <p>
      This document is a placeholder for the GUI component of the
      WebGainUnityWeb.
    </p>
  </body>
</html>
)";

//==============================================================================
bool SinglePageBrowser::pageAboutToLoad (const juce::String& newURL)
{
    return newURL == localDevServerAddress || newURL == getResourceProviderRoot();
}

