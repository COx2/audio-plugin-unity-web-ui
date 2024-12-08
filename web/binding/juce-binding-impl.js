const gainSliderState = getSliderState("gain");
const invertPhaseToggleState = getToggleState("invertPhase");

bindFunction('js_SetParameter', 
    (id_utf8, value) => {
        const id_str = helperFunctions.UTF8ToString(id_utf8);
        if(id_str == "gain")
        {
            gainSliderState.setNormalisedValue(value);
        }
        else if(id_str == "invertPhase")
        {
            let bValue = false;
            if(value == 1)
            {
                bValue = true;
            }
            invertPhaseToggleState.setValue(bValue);
        }
        console.log(id_str + " - Set: " + value);
    }
)

bindFunction('js_GetParameter', 
    (id_utf8) => {
        const id_str = helperFunctions.UTF8ToString(id_utf8);
        let value = 0.0;
        if(id_str == "gain")
        {
            value = gainSliderState.getNormalisedValue();
        }
        else if(id_str == "invertPhase")
        {
            value = invertPhaseToggleState.getValue();
        }
        console.log(id_str + " - Get: " + value);
        return value;
    }
)
