const NumberToBits = 9 // по условиям граница 300 - это 9 бит
const packToBits = 7 // по условиям дана ASCII - это 7 бит 

function serialize(arr) {
    let bitStr = ''

    arr.forEach(num => bitStr += num.toString(2).padStart(NumberToBits, '0'))
    
    //выравниваем набор для упаковки в 7 бит
    const countToStable = packToBits - bitStr.length % packToBits
    bitStr += '0'.repeat(countToStable)
    let res = ''
    for (let i = 0; i < bitStr.length; i += packToBits) {
        const part = bitStr.slice(i, i + packToBits)
        const partInDec = parseInt(part, 2)
        res += String.fromCharCode(partInDec)
    }
    return res
}

function deserialize(str) {
    let bitStr = ''
    Array.from(str).forEach((char, i) => {
        const num = str.charCodeAt(i)
        bitStr += num.toString(2).padStart(packToBits, '0')
    })
    //выравниваем набор для распаковки по 9 бит
    const countToStable = bitStr.length % NumberToBits * -1
    bitStr = bitStr.slice(0, countToStable)
    const res = []
    for (let i = 0; i < bitStr.length; i += NumberToBits) {
        const partBits = bitStr.slice(i, i + NumberToBits)
        res.push(parseInt(partBits, 2))
    }
    return res
}

function profil(arr) {
    const serialized = serialize(arr)
    const source = arr.join(',')
    const oldCount = source.length
    const newCount = serialized.length
    const koef = newCount / oldCount
    return {
        source,
        serialized,
        oldCount,
        newCount,
        koef
    }
 
}

function genTestData() {
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    let s = 0
    return [
        new Array(rnd(5, 10)).fill().map(v => rnd(1, 10)), //short
        new Array(50).fill().map(v => rnd(1, 300)), //random 50
        new Array(100).fill().map(v => rnd(1, 300)), //random 100
        new Array(500).fill().map(v => rnd(1, 300)), //random 500
        new Array(1000).fill().map(v => rnd(1, 300)), //random 1000
        new Array(1000).fill().map(v => 1), //граничные 1 знака 
        new Array(1000).fill().map(v => 9), //граничные 1 знака
        new Array(1000).fill().map(v => 10), //граничные 2 знака
        new Array(1000).fill().map(v => 99), //граничные 2 знака
        new Array(1000).fill().map(v => 200), //граничные 3 знака
        new Array(1000).fill().map(v => 300), //граничные 3 знака
        new Array(900).fill().map((v, i) => { //каждого числа по 3
            if (i % 3 == 0) s++ 
            return s
        })
    ]
}

function runTest() {
    let sum = 0
    const testData = genTestData()
    testData.forEach(test => {
        const {koef, serialized, source} = profil(test)
        sum += koef
        console.log(`исходная строка: ${source}\nсжатая строка: ${serialized}\nкоэф сжатия: ${koef}`)
    })
    console.log(`усредненный коэф по тестам: ${sum / testData.length}`)
}