import { ActionPanel, Detail, useNavigation } from "@raycast/api";
import { parsePos } from "../../JotobaUtils";
import OpenInJotoba from "../../actions/OpenInJotoba";

function WordDetailsView({ wordResult }: { wordResult: WordResult }) {
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

    return (
        <Detail
            navigationTitle={`Jotoba ・${reading || kanaReading}`}
            markdown={`# ${title}\n${
                (pitch && parsedPitch) || ""
            }\n${parsedSenses}`}
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
