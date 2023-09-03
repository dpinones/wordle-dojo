
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
