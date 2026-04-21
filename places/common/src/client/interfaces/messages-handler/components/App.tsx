import { UUID } from "@common/shared/utils/TypeWrapper.utils";
import { Message, MessageStyle } from "./Message";
import React, { useMemo } from "@rbxts/react";
import { usePx } from "@common/shared/interfaces/hooks/usePx";
import { GenerateUUID } from "@common/shared/utils/GenerateUUID.utils";

export interface MessagesHandlerAPI {
    createMessage: (message: MessageStyle) => UUID;
    destroyMessage: (id: UUID) => void;
}

interface AppProps {
    onReady: (api: MessagesHandlerAPI) => void;
}

export function App({ onReady }: AppProps) {
    const px = usePx();
    const [messages, setMessages] = React.useState<(MessageStyle & {id: UUID})[]>([]);

    const api: MessagesHandlerAPI = React.useMemo(() => {
        return {
            createMessage: (message) => {
                const id = GenerateUUID.generateHexSegment();
                
                setMessages((prev) => [
                    ...prev,
                    {
                        ...message,
                        id
                    }
                ])

                return id
            },
            destroyMessage: (id) => {
                setMessages((prev) => prev.filter((message) => message.id !== id))
            }
        }
    }, [])

    React.useEffect(() => {
        onReady(api);
    }, [])

    return (
        <frame
            BackgroundTransparency={1}
            Size={UDim2.fromScale(1, 0)}
            Position={UDim2.fromScale(0.5, 0.17)}
            AnchorPoint={new Vector2(0.5, 0)}
        >
            <uilistlayout 
                SortOrder={Enum.SortOrder.LayoutOrder}
                HorizontalAlignment={Enum.HorizontalAlignment.Center}
                
                Padding={new UDim(0, px(10))}
            />
            {messages.map((message, index) => <Message key={message.id} index={index} {...message} />)}
        </frame>
    )
}