const countWords = (str) => {
    const words = str.match(/(?:^|\s)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*[.,!?]?(?=\s|$)/g)
    
    return words ? words.length : 0
}

const text = "Saat meng*ecat tembok, Agung dib_antu oleh Raihan."
// const text = "Berapa u(mur minimal[ untuk !mengurus ktp?"
// const text = "Masing-masing anak mendap(atkan uang jajan ya=ng be&rbeda."
const wordCount = countWords(text)
console.log(wordCount)
