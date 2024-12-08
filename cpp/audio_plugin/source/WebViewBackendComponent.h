#pragma once

#include <juce_gui_extra/juce_gui_extra.h>

#include "SinglePageBrowser.h"
#include "PluginProcessor.h"

//==============================================================================
class WebViewBackendComponent
    : public juce::Component
{
public:
    //==============================================================================
    explicit WebViewBackendComponent(AudioPluginAudioProcessor& processor);
    ~WebViewBackendComponent() override;

private:
    //==============================================================================
    void paint(juce::Graphics&) override;
    void resized() override;

    //==============================================================================
    std::unique_ptr<SinglePageBrowser> makeWebView();
    std::optional<juce::WebBrowserComponent::Resource> getResource(const juce::String& url);

    //==============================================================================
    AudioPluginAudioProcessor& processorRef;

    juce::MemoryInputStream misWebViewBundle;
    std::unique_ptr<juce::ZipFile> zipWebViewBundle;

    juce::WebSliderRelay gainSliderRelay{ "gain" };
    juce::WebSliderParameterAttachment gainAttachment;

    juce::WebToggleButtonRelay invertPhaseToggleButtonRelay{ "invertPhase" };
    juce::WebToggleButtonParameterAttachment invertPhaseAttachment;

    std::unique_ptr<SinglePageBrowser> webView;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR(WebViewBackendComponent)
};
