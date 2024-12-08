using System;
using System.Runtime.InteropServices;
using AOT;
using UnityEngine;
using UnityEngine.UI;

public class AudioPluginController : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void js_SetParameter(String paramId, float value);
    
    [DllImport("__Internal")]
    private static extern float js_GetParameter(String paramId);

    public Slider gainParameterSlider;
    public String gainParameterId;
    
    public Toggle invertPhaseParameterToggle;
    public String invertPhaseParameterId;

    void Start()
    {
        gainParameterSlider.onValueChanged.AddListener(OnGainSliderValueChanged);
        invertPhaseParameterToggle.onValueChanged.AddListener(OnInvertPhaseToggleValueChanged);
    }

    void Update()
    {
#if !UNITY_EDITOR
        {
            float value = js_GetParameter(gainParameterId);
            gainParameterSlider.SetValueWithoutNotify(value);
        }

        {
            float fValue = js_GetParameter(invertPhaseParameterId);
            bool bValue = fValue > 0.5f ? true : false;
            invertPhaseParameterToggle.SetIsOnWithoutNotify(bValue);
        }
#endif
    }

    void OnGainSliderValueChanged(float value)
    {
#if !UNITY_EDITOR
        js_SetParameter(gainParameterId, value);
#endif
    }

    void OnInvertPhaseToggleValueChanged(bool bValue)
    {
#if !UNITY_EDITOR
        float value = bValue ? 1.0f : 0.0f;
        js_SetParameter(invertPhaseParameterId, value);
#endif
    }

}
