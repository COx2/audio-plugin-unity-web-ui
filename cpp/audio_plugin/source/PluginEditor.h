#pragma once

#include <juce_gui_extra/juce_gui_extra.h>
#include <juce_data_structures/juce_data_structures.h>
#include <juce_audio_utils/juce_audio_utils.h>

#include "PluginProcessor.h"
#include "WebViewBackendComponent.h"

//==============================================================================
class AudioPluginAudioProcessorEditor final
    : public juce::AudioProcessorEditor
{
public:
    //==============================================================================
    explicit AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor&);
    ~AudioPluginAudioProcessorEditor() override;

private:
    //==============================================================================
    void paint (juce::Graphics&) override;
    void resized() override;

    //==============================================================================
    AudioPluginAudioProcessor& processorRef;

    std::unique_ptr<juce::GenericAudioProcessorEditor> genericEditor;
    std::unique_ptr<WebViewBackendComponent> webViewBackend;
    
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (AudioPluginAudioProcessorEditor)
};
