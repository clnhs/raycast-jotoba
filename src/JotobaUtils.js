export const parseReadings = readings => {
    if (!readings || readings.length === 0) return "";

    return readings
        .map(reading => reading.replace(".", "・").replace("-", "ー"))
        .join(", ");
};

import * as posData from "./PartsOfSpeech.json";

export const parsePos = (pos, short = false, kana = false, lang = "en") => {
    let posStr = "missing";
    let posMatch = null;
    if (typeof pos === "object") {
        const mainPart = Object.keys(pos)[0];
        const subPart = Object.values(pos)[0];
        if (subPart) posMatch = posData.detailed[mainPart][subPart];
        else posMatch = posData.detailed[mainPart];
    } //string
    else posMatch = posData.simple[pos];

    if (posMatch) {
        if (short) posStr = posMatch.short;
        else posStr = posMatch.long;
    }

    return posStr;
};

export const parsePos_old = part => {
    const partsOfSpeech = [];

    if (typeof part === "string") {
        if (part !== "AuxiliaryVerb") {
            partsOfSpeech.push(`Auxiliary verb`);
        } else partsOfSpeech.push(part);
    } else if (Object.hasOwn(part, "Verb")) {
        if (typeof part.Verb === "string")
            partsOfSpeech.push(part.Verb + " verb");
        else if (Object.hasOwn(part.Verb, "Godan")) {
            partsOfSpeech.push(`Godan verb`);
        } else if (Object.hasOwn(part.Verb, "Irregular")) {
            if (part.Verb.Irregular === "NounOrAuxSuru")
                partsOfSpeech.push(`する verb`);
        }
    } else if (Object.hasOwn(part, "Noun")) {
        if (part.Noun === "Normal") partsOfSpeech.push(`Noun`);
        else partsOfSpeech.push(part.Noun.toLowerCase() + " noun");
    } else if (Object.hasOwn(part, "Adjective"))
        if (part.Adjective === "PreNounVerb")
            partsOfSpeech.push(`Pre-noun/verb adj.`);
        else if (part.Adjective === "Keiyoushi")
            partsOfSpeech.push(`I-adj. 【Keiyoushi】`);
        else partsOfSpeech.push(`${part.Adjective} adj.`);
    else partsOfSpeech.push(JSON.stringify(part.Verb));

    return partsOfSpeech;
};
