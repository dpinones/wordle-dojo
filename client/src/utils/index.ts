
export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export function getComponent(entities: any[] | null | undefined, keysFilter: string[]): any | null {
    if (!isValidArray(entities)) return null;

    for (let entity of entities) {
        if (isValidArray(entity?.node.components)) {
            if (entity.node.keys.length == keysFilter.length) {
                if (entity.node.keys.every((k: string) => keysFilter.includes(k))) {
                    return entity.node.components[0];
                }
            } 
        }
    }
    return null;
}

export function toHexPrefixedString(num: number): string {
    return '0x' + num.toString(16);
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {
    if (!isValidArray(entities) || !entities[0]?.keys) return null;

    return entities[0].keys.replace(/,/g, '');
}

export function getEpocDay(): number {
    const currentTimeMillis = Date.now();
    const epocDay = Math.floor(currentTimeMillis / 86400000);
    return epocDay;
}

function charactersIntoArray(numero: number): number[] {
    const digitos: number[] = [];
    
    while (numero > 0) {
        const ultimoDigito = numero % 10;
        const penultimo_digito = Math.floor(numero / 10) % 10;
        digitos.push(penultimo_digito * 10 + ultimoDigito); // Agregar el dígito al final del array
        numero = Math.floor(numero / 100); // Avanzar dos dígitos hacia atrás
    }
    return digitos.reverse(); // Invertir el array para obtener el orden correcto
}

// export function charactersIntoArray(word: number): number[] {
//     let ret: number[] = [];
//     let iterable = word;

//     while (true) {
//         if (iterable < 10) {
//             break;
//         }
//         const lastDigit = iterable % 10;
//         const penultimateDigit = Math.floor(iterable / 10) % 10;
//         ret.push(penultimateDigit * 10 + lastDigit);
//         iterable = Math.floor(iterable / 100);
//     }

//     if (iterable > 0) {
//         ret.push(iterable);
//     }

//     if (ret.length !== WORDS_LEN) {
//         throw new Error('Wrong word length!');
//     }

//     // Invertir el array
//     ret.reverse();
//     console.log("return: ", ret)
//     return ret;
// }

export function numberToLetter(num: number): string {
    // Verifica que el número esté dentro del rango válido (1-26 para a-z)
    if (num < 1 || num > 26) {
        throw new Error('Número fuera del rango válido (1-26)');
    }

    // Convierte el número a una letra siguiendo el patrón a=1, b=2, ...
    const letter = String.fromCharCode(96 + num);  // 96 es el código ASCII para el caracter previo a 'a'
    
    return letter;
}

export function letterToNumber(letter: string): number {
    // Verifica que la entrada sea una sola letra y que esté en el rango de 'a' a 'z'
    if (letter.length !== 1 || letter < 'a' || letter > 'z') {
        throw new Error('Entrada inválida. Debe ser una sola letra entre a y z.');
    }

    // Convierte la letra a un número siguiendo el patrón a=1, b=2, ...
    const num = letter.charCodeAt(0) - 96;  // 96 es el código ASCII para el caracter previo a 'a'

    return num;
}

export function generateWord(characters: number): string {
    let characterDictionary = charactersIntoArray(characters);
    let word = '';
    for (let i = 0; i < characterDictionary.length; i++) {
        word += numberToLetter(characterDictionary[i]);
    }
    return word;
}

export function generateNumber(word: string): number {
    let ret = '';
    for (let i = 0; i < word.length; i++) {
        let number = letterToNumber(word[i]);
        if (number < 10) {
            ret += '0';
        }
        ret += number;
    }
    return Number(ret);
}