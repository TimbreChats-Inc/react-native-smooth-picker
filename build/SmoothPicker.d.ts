import React, { Component, ComponentType } from "react";
import { FlatList, LayoutRectangle, FlatListProps, ListRenderItemInfo, StyleProp, ViewStyle } from "react-native";
export interface ListReturn {
    item: any;
    index: number;
}
export interface Option extends ListReturn {
    layout: LayoutRectangle;
    left: number;
    top: number;
    right: number;
    bottom: number;
}
export declare type SnapAlignement = "start" | "center" | "end";
export interface Snap {
    snapToInterval: number;
    snapToAlignment: SnapAlignement;
}
export declare type HandleSelection = (item: any, index: number, scrollPosition: number | null) => void;
export interface SmoothPickerProps extends FlatListProps<any> {
    onSelected?: (obj: ListReturn) => void;
    offsetSelection?: number;
    magnet?: boolean;
    scrollAnimation?: boolean;
    snapInterval?: number | null;
    snapToAlignment?: SnapAlignement;
    initialScrollToIndex?: number;
    startMargin?: number;
    endMargin?: number;
    refFlatList?: React.MutableRefObject<FlatList | null>;
    selectOnPress?: boolean;
    styleButton?: StyleProp<ViewStyle>;
    activeOpacityButton?: number;
    flatListComponent: ComponentType<FlatListProps<any> & {
        ref: React.RefObject<FlatList<any>>;
    }>;
}
interface State {
    selected: number;
    scrollPosition: number | null;
}
declare class SmoothPicker extends Component<SmoothPickerProps, State> {
    widthParent: number;
    heightParent: number;
    onMomentum: boolean;
    fingerAction: boolean;
    options: Option[];
    countItems: number;
    refList: React.RefObject<FlatList>;
    state: {
        selected: number;
        scrollPosition: null;
    };
    componentDidMount(): void;
    _alignAfterMount: () => void;
    _save: (i: number, layout: LayoutRectangle, item: any, horizontal: boolean | null) => void;
    _handleSelection: HandleSelection;
    _renderItem: (info: ListRenderItemInfo<any>) => JSX.Element | null;
    render(): JSX.Element;
}
export default SmoothPicker;
