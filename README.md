# audio-plugin-unity-web-ui
This is an example of implementing a graphical user interface for audio plugin with Unity Web platform.

<img src="./docs/images/screen_shot.png" title="screeen shot">

## Supported versions

- Unity 6000.0.29f1
- JUCE 8.0.4
- Visual Studio 2022
- Xcode 15.1
- Deno 2.1.3 (for build utility tools)


## System overview

```mermaid
graph TB
    subgraph UnityProject["Unity Project"]
        csharp["C# Scripts<br/>DllImport definition"]
        jslib["plugin.jslib<br/>binding method declaration<br/>emscripten::__postset execution"]
    end
        
    csharp --> |"DllImport"| jslib
```

```mermaid
graph TB
    subgraph Native["VST3 Plugin"]
        subgraph Browser["WebView UI"]
            unity_web["Unity Web build<br/>UI Components"]
            jslib_p["plugin.jslib<br/>binding method declaration<br/>emscripten::__postset execution"]
            libjs["unity-binding-lib.js"]
            mainjs["juce-binding-impl.js"]
            jucejs["juce-framework-frontend.js"]
        end
        vst3["JUCE C++<br/>WebView<br/>VST3 API"]
    end

    subgraph DAW["DAW（VST3 Host）"]
        daw["VST3 API"]
    end
    
    jslib_p <--> |"DllImport"| unity_web
    libjs <--> |"postset"| jslib_p
    libjs <--> |"function call"| mainjs
    mainjs <--> |"parameter control"| jucejs
    jucejs <--> |"bind function"| vst3
    vst3 <--> |"Load Plugin"| daw
```
