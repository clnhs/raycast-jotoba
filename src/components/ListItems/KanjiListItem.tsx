import {
    ActionPanel,
    List,
    OpenInBrowserAction,
    PushAction,
} from "@raycast/api";
import OpenInJotoba from "../../actions/OpenInJotoba";
import KanjiDetailsView from "../Details/KanjiDetailsView";

function KanjiListItem({ kanjiResult }: { kanjiResult: KanjiResult }) {
    const { literal, stroke_count, grade, jlpt, onYomi, kunYomi, url } =
        kanjiResult;

    const subtitle = (): Array<string> => {
        const subtitle: Array<string> = [];
        if (onYomi.length) subtitle.push(`【on】: ${onYomi}`)
        if (kunYomi.length) subtitle.push(`【kun】: ${kunYomi}`)
        return subtitle;
    };

    const accessoryTitle = (): Array<string> => {
        const accessoryTitle: Array<string> = [];

        if (stroke_count) accessoryTitle.push(`🖌${stroke_count}`);
        if (jlpt) accessoryTitle.push(`JLPT N${jlpt}`);
        if (grade) accessoryTitle.push(`🎓${grade}`);

        return accessoryTitle;
    };

    return (
        <List.Item
            title={literal}
            subtitle={subtitle().join("")}
            accessoryTitle={accessoryTitle().join("・")}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <PushAction
                            title={"See more..."}
                            target={
                                <KanjiDetailsView kanjiResult={kanjiResult} />
                            }
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                        <OpenInJotoba searchTerm={literal} />
                    </ActionPanel.Section>
                </ActionPanel>
            }
        />
    );
}

export default KanjiListItem;
