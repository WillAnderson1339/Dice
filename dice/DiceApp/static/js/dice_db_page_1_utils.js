
function GetDiceInfo() {
    console.log("GetDiceInfo()");

    $("#diceInfoId").removeAttr("hidden");

    dice_id = Number($('#dice_id').val());
    console.log("id to retrieve = ", dice_id);

    element = document.getElementById("diceNameId");
    element.innerHTML = "Hello world!";

    //elementText = "<audio id=\"" + diceSoundId + "\"><source src=\"" + diceSoundFile + "\" type=\"audio/mpeg\">audio not supported</audio>";
    elementText = "<li>Foo</li>"
    //console.log("elementText = ", elementText);

    $("#diceFacesId").append(elementText);

    elementText = "<li>Bar</li>"
    //console.log("elementText = ", elementText);

    $("#diceFacesId").append(elementText);

}