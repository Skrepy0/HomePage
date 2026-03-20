export let Quote = {}
const path:string = "/text/quotes.json"
fetch(path).then(res => res.json()).then(json => {
    Quote = json['context'];
})