import { ActionPanel, Color, Icon, List, PushAction } from "@raycast/api";
import WordDetailsView from "../Details/WordDetailsView";
import OpenInJotoba from "../../actions/OpenInJotoba";
import { parsePos } from "../../JotobaUtils";

function WordListItem({ wordResult }: { wordResult: WordResult }) {
    const { reading, kanaReading, senses, url } = wordResult;
    return (
        <List.Item
            title={reading}
            subtitle={kanaReading}
            accessoryTitle={senses
                .map(
                    (sense: { pos: Json[]; glosses: Json[] }) =>
                        sense.pos.map((p: Json) => parsePos(p)) +
                        " " +
                        sense.glosses.join("; ")
                )
                .join(" | ")}
            icon={
                (wordResult.common && {
                    source: Icon.Dot,
                    tintColor: Color.Green,
                }) ||
                undefined
            }
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <PushAction
                            title={"See more..."}
                            target={<WordDetailsView wordResult={wordResult} />}
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                        <OpenInJotoba searchTerm={reading} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default WordListItem;
