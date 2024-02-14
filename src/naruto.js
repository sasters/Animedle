var switchValue = true; // ou false selon votre cas

var classicPath = 'naruto/index.html?switchValue='
var logoPath = 'naruto/logo.html?switchValue='

var toggleSwitch = document.getElementById("switch");
    toggleSwitch.addEventListener("change", function() {
    switchValue = this.checked;
    if(!switchValue) { document.getElementById("switch-text").textContent = "Utilise les personnages de Naruto et Boruto." }
    else { document.getElementById("switch-text").textContent = "Utilise que les personnages de Naruto." }

    document.getElementById('classic').href = classicPath+switchValue;
    document.getElementById('logo').href = logoPath+switchValue;
});