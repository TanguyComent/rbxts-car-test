import { STUD_TEXTURE } from "@common/shared/Assets";
import React from "@rbxts/react";
import { usePx } from "../hooks/usePx";

interface StudFrameProps extends React.InstanceProps<ImageLabel> {
    
}

export function StudFrame(props: StudFrameProps) {
    const px = usePx();

    delete props.Image;
    delete props.ScaleType;
    delete props.SliceScale;
    
    return (
        <imagelabel
            {...props}
            Image={STUD_TEXTURE}
            ScaleType={Enum.ScaleType.Tile}
            TileSize={new UDim2(0, px(125), 0, px(125))}
        >
            {props.children}
        </imagelabel>
    )
}