#include "PluginProcessor.h"
#include "PluginEditor.h"

//==============================================================================
AudioPluginAudioProcessorEditor::AudioPluginAudioProcessorEditor (AudioPluginAudioProcessor& p)
    : AudioProcessorEditor (&p)
    , processorRef (p)
{
    // Native view
    genericEditor = std::make_unique<juce::GenericAudioProcessorEditor>(processorRef);
    addAndMakeVisible(genericEditor.get());

    // Web view
    webViewBackend = std::make_unique<WebViewBackendComponent>(processorRef);
    addAndMakeVisible(webViewBackend.get());

    // Make sure that before the constructor has finished, you've set the
    // editor's size to whatever you need it to be.
    setSize (960, 640);
    setResizable(true, true);
}

AudioPluginAudioProcessorEditor::~AudioPluginAudioProcessorEditor()
{
}

//==============================================================================
void AudioPluginAudioProcessorEditor::paint (juce::Graphics& g)
{
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));
}

void AudioPluginAudioProcessorEditor::resized()
{
    // This is generally where you'll want to lay out the positions of any
    // subcomponents in your editor..

    auto rect_ui = getLocalBounds();

#if 0
    auto rect_juce_ui = rect_ui.removeFromRight(rect_ui.getWidth() * 0.5f);
    {
        genericEditor->setBounds(rect_juce_ui);
    }
#endif

    auto rect_web_ui = rect_ui;

    webViewBackend->setBounds (rect_web_ui);
}
