cmake_minimum_required(VERSION 3.22)
project(WebGainUnityWeb VERSION 0.1.0)

# ---- Include guards ----
if(PROJECT_SOURCE_DIR STREQUAL PROJECT_BINARY_DIR)
    message(
    FATAL_ERROR
        "In-source builds not allowed. Please make a new directory (called a build directory) and run CMake from there."
    )
endif()

# First, we'll add the CMake folder, incase we'll need to find_package later:
list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/cmake")

# Minimum MacOS target, set globally
if (${CMAKE_SYSTEM_NAME} STREQUAL "iOS")
    set(CMAKE_OSX_DEPLOYMENT_TARGET 11.0 CACHE STRING "Minimum OS X deployment version" FORCE)

    # code signing to run on an iOS device:
#    set(CMAKE_XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer" CACHE STRING "" FORCE)
#    set(CMAKE_XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "XXXXXXXXXX" CACHE STRING "" FORCE)
else()
    set(CMAKE_OSX_DEPLOYMENT_TARGET "10.15" CACHE STRING "Minimum OS X deployment version" FORCE)
endif()

option(UniversalBinary "Build universal binary for mac" ON)

if (UniversalBinary)
    set(CMAKE_OSX_ARCHITECTURES "x86_64;arm64" CACHE INTERNAL "")
endif()

# Static linking in Windows
set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

# For building in multibyte language environment.
if(CMAKE_CXX_COMPILER_ID MATCHES "MSVC")
    add_compile_options(/utf-8)
endif()

# We 'require' that we need juce. If JUCE isn't found, it will revert to what's in
# CMake/Findjuce.cmake, where you can see how JUCE is brought in/configured
find_package(juce REQUIRED)

# Start plugin target setup
set (BaseTargetName WebGainUnityWeb)

juce_add_plugin("${BaseTargetName}"
    # VERSION ...
    # ICON_BIG ...
    # ICON_SMALL ...
    COMPANY_NAME "COx2"
    NEEDS_WEBVIEW2 TRUE         # On Windows, JUCE may or may not need to link to WebView2 depending on the compile definitions...
    NEEDS_WEB_BROWSER TRUE      # On Linux, JUCE may or may not need to link to Webkit depending on the compile definitions...
    IS_SYNTH FALSE
    NEEDS_MIDI_INPUT TRUE
    NEEDS_MIDI_OUTPUT FALSE
    IS_MIDI_EFFECT FALSE
    EDITOR_WANTS_KEYBOARD_FOCUS FALSE
    COPY_PLUGIN_AFTER_BUILD FALSE
    PLUGIN_MANUFACTURER_CODE Cox2
    PLUGIN_CODE Wguw
    FORMATS Standalone VST3 AU)

juce_add_binary_data("${BaseTargetName}_WebViewBundle"
    HEADER_NAME "WebViewBundleData.h"
    NAMESPACE "WebView"
    SOURCES
        resources/WebViewBundle.zip
    )

# Need to build BinaryData with -fPIC flag on Linux
set_target_properties("${BaseTargetName}_WebViewBundle"
    PROPERTIES
        POSITION_INDEPENDENT_CODE TRUE)

target_sources(${BaseTargetName}
    PRIVATE
        Source/PluginProcessor.cpp
        Source/PluginProcessor.h
        Source/PluginEditor.cpp
        Source/PluginEditor.h
        Source/SinglePageBrowser.cpp
        Source/SinglePageBrowser.h
        Source/WebViewBackendComponent.cpp
        Source/WebViewBackendComponent.h
        )

target_compile_definitions(${BaseTargetName}
    PUBLIC
        JUCE_WEB_BROWSER=1
        JUCE_USE_WIN_WEBVIEW2_WITH_STATIC_LINKING=1
        JUCE_USE_CURL=0
        JUCE_VST3_CAN_REPLACE_VST2=0)

# Use PUBLIC to effect linked target like VST3, Standalone, CLAP, ...
target_compile_features(${BaseTargetName}
    PUBLIC
        cxx_std_17)

target_link_libraries(${BaseTargetName}
    PRIVATE
        "${BaseTargetName}_WebViewBundle"
        juce::juce_gui_extra
        juce::juce_audio_utils
        juce::juce_audio_devices
    PUBLIC
        juce::juce_recommended_config_flags
        juce::juce_recommended_lto_flags
        juce::juce_recommended_warning_flags)

message(STATUS "[${BaseTargetName}] Binary directory: ${CMAKE_CURRENT_BINARY_DIR}")

# Add cmake install task for this project.
if(TARGET ${BaseTargetName}_VST3)
    get_target_property(VST3_PRODUCT_FILE ${BaseTargetName}_VST3 JUCE_PLUGIN_ARTEFACT_FILE)
    
    message("[${BaseTargetName}] VST3_PRODUCT_FILE: ${VST3_PRODUCT_FILE}")

    if(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
        install(FILES "${VST3_PRODUCT_FILE}"
                DESTINATION "/Library/Audio/Plug-Ins/VST3"
                COMPONENT ${BaseTargetName}_VST3)
    elseif(CMAKE_SYSTEM_NAME STREQUAL "Windows")
        install(FILES "${VST3_PRODUCT_FILE}"
                DESTINATION "C:/Program Files/Common Files/VST3"
                COMPONENT ${BaseTargetName}_VST3)
    elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
        install(FILES "${VST3_PRODUCT_FILE}"
                DESTINATION "/usr/lib/vst3"
                COMPONENT ${BaseTargetName}_VST3)
    endif()

endif()

if(TARGET ${BaseTargetName}_AU)
    get_target_property(AU_PRODUCT_FILE ${BaseTargetName}_AU JUCE_PLUGIN_ARTEFACT_FILE)

    message("[${BaseTargetName}] AU_PRODUCT_FILE: ${AU_PRODUCT_FILE}")

    if(CMAKE_SYSTEM_NAME STREQUAL "Darwin")
        install(FILES "${AU_PRODUCT_FILE}"
                DESTINATION "/Library/Audio/Plug-Ins/Components"
                COMPONENT ${BaseTargetName}_AU)
    endif()

endif()
