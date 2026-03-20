export let LanguageColors = {}
const path:string = "/text/language.json"
fetch(path).then(res => res.json()).then(json => {
    LanguageColors = json["colors"];
})