import { ActionPanel, Detail, useNavigation } from "@raycast/api";
import { parsePos } from "../../JotobaUtils";
import OpenInJotoba from "../../actions/OpenInJotoba";
import { useEffect, useState } from "react";
import useJotoba from "../../useJotoba";

function WordDetailsView({ wordResult }: { wordResult: WordResult }) {
    const [sentences, setSentences] = useState([]);
    const {
        getJotobaResults: getJotobaSentences,
    } = useJotoba("sentences");

    const { reading, common, senses, pitch } = wordResult;

    const title = `${common ? `🟢&nbsp;` : ""}${
        reading.kanji && reading.kanji !== reading.kana
            ? `${reading.kanji}【${reading.kana}】`
            : reading.kana
    }`;

    const parsedSenses = senses
        .map((sense: { pos: PartOfSpeech[]; glosses: string[] }) => {
            const posName = sense.pos.map((p: Json) => parsePos(p));
            const glossesList = sense.glosses
                .map(gloss => `- ${gloss}`)
                .join(`\n`);

            return `### ${posName.join(", ")}\n${glossesList}`;
        })
        .join(`\n`);

    const parsedPitch = pitch?.reduce((acc, curr) => {
        const { part, high } = curr;

        if (high) return acc + `↗${part}↘`;

        return acc + part;
    }, "");

    useEffect(() => {
        getJotobaSentences(
            reading.kanji || reading.kana,
            (resultSentences) =>
                setSentences(
                    resultSentences.sentences
                        .map(
                            (sentence: JotobaSentence) =>
                                `- ${sentence.content}\n${sentence.translation}`,
                        )
                        .join("\n"),
                ),
        );
    }, [setSentences]);

    return (
        <Detail
            navigationTitle={`Jotoba ・${reading.kanji || reading.kana}`}
            markdown={`# ${title}
            \n${parsedPitch || ""}
            \n${parsedSenses}
            \n${
                (sentences.length > 0 &&
                    `## Example Sentences
                \n${sentences}`) ||
                ""
            }
            `}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <OpenInJotoba searchTerm={reading.kanji || reading.kana} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default WordDetailsView;
