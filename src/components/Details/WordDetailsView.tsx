import { ActionPanel, Detail, useNavigation } from "@raycast/api";
import { parsePos } from "../../JotobaUtils";
import OpenInJotoba from "../../actions/OpenInJotoba";
import { SetStateAction, useEffect, useState } from "react";
import useJotoba from "../../useJotoba";

function WordDetailsView({ wordResult }: { wordResult: WordResult }) {
    const [sentences, setSentences] = useState([]);
    const {
        jotobaIsLoading: jotoSentencesIsLoading,
        jotobaHasError: jotoSentencesHasError,
        getJotobaResults: getJotobaSentences,
    } = useJotoba("sentences");

    const [exampleSentences, setExampleSentences] = useState(null);

    const { reading, kanaReading, common, senses, pitch, url } = wordResult;
    const { pop } = useNavigation();
    const title = `${
        reading !== kanaReading
            ? reading + "【" + kanaReading + "】"
            : kanaReading
    }`;
    const parsedSenses = senses
        .map((sense: { pos: Json[]; glosses: Json[] }) => {
            const posName = sense.pos.map((p: Json) => parsePos(p));
            const glossesList = sense.glosses
                .map(gloss => `- ${gloss}`)
                .join(`\n`);

            return `### ${posName.join(", ")}\n${glossesList}`;
        })
        .join(`\n`);
    const parsedPitch = pitch?.reduce((acc, curr, index) => {
        const { part, high } = curr;

        if (high) return acc + `↗${part}↘`;

        return acc + part;
    }, "");

    useEffect(() => {
        getJotobaSentences(
            reading || kanaReading,
            (resultSentences: {
                sentences: {
                    map: (arg0: (sentence: Json[]) => string) => {
                        join: {
                            (arg0: string): SetStateAction<never[]>;
                        };
                    };
                };
            }) =>
                setSentences(
                    resultSentences.sentences
                        .map(
                            sentence =>
                                `- ${sentence.content}\n${sentence.translation}`
                        )
                        .join("\n")
                )
        );
    }, [setSentences]);

    useEffect(() => {
        console.log(JSON.stringify(sentences));
    }, [sentences]);

    return (
        <Detail
            navigationTitle={`Jotoba ・${reading || kanaReading}`}
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
                        <OpenInJotoba searchTerm={reading} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default WordDetailsView;
