import React, { Component } from "react";
import { View, FlatList, TouchableOpacity, } from "react-native";
import onSelect from "./functions/onSelect";
import alignSelect from "./functions/alignSelect";
import { marginStart, marginEnd } from "./functions/onMargin";
class SmoothPicker extends Component {
    constructor() {
        super(...arguments);
        this.widthParent = 0;
        this.heightParent = 0;
        this.onMomentum = false;
        this.fingerAction = false;
        this.options = [];
        this.countItems = 0;
        this.refList = React.createRef();
        this.state = {
            selected: this.props.initialScrollToIndex || 1,
            scrollPosition: null,
        };
        this._alignAfterMount = () => {
            try {
                const { horizontal = false, scrollAnimation = false, initialScrollToIndex, } = this.props;
                if (typeof initialScrollToIndex !== "undefined") {
                    const option = this.options[initialScrollToIndex];
                    if (option) {
                        alignSelect(horizontal, scrollAnimation, option, this.refList);
                    }
                }
            }
            catch (error) {
                console.log("error", error);
            }
        };
        this._save = (i, layout, item, horizontal) => {
            const nOpt = {
                layout,
                item,
                index: i,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            };
            this.options[i] = nOpt;
            this.options.forEach((option) => {
                const { index } = option;
                if (horizontal) {
                    let left = this.options[index - 1]
                        ? this.options[index - 1].right
                        : 0;
                    let right = this.options[index - 1]
                        ? left + this.options[index].layout.width
                        : this.options[index].layout.width;
                    this.options[index].right = right;
                    this.options[index].left = left;
                }
                else {
                    let top = this.options[index - 1]
                        ? this.options[index - 1].bottom
                        : 0;
                    let bottom = this.options[index - 1]
                        ? top + this.options[index].layout.height
                        : this.options[index].layout.height;
                    this.options[index].bottom = bottom;
                    this.options[index].top = top;
                }
            });
        };
        this._handleSelection = (item, index, scrollPosition) => {
            if (this.props.onSelected) {
                this.props.onSelected({ item, index });
            }
            this.setState({
                selected: index,
                scrollPosition: scrollPosition,
            });
        };
        this._renderItem = (info) => {
            const { data, renderItem, horizontal = false, offsetSelection = 0, startMargin, endMargin, selectOnPress, styleButton = {}, activeOpacityButton = 0.2, } = this.props;
            const { item, index } = info;
            const handlePressOnItem = () => {
                this._handleSelection(item, index, null);
            };
            if (!data) {
                return null;
            }
            return (<View key={index} onLayout={({ nativeEvent: { layout } }) => {
                this._save(index, layout, item, horizontal);
                if (this.countItems === data.length - 1) {
                    this.countItems = 0;
                    this._alignAfterMount();
                }
                else {
                    this.countItems = this.countItems + 1;
                }
            }} style={{
                marginLeft: marginStart(horizontal, index, this.widthParent, offsetSelection, startMargin),
                marginRight: marginEnd(horizontal, data.length - 1, index, this.widthParent, offsetSelection, endMargin),
                marginTop: marginStart(!horizontal, index, this.heightParent, offsetSelection, startMargin),
                marginBottom: marginEnd(!horizontal, data.length - 1, index, this.heightParent, offsetSelection, endMargin),
            }}>
        {renderItem && !selectOnPress && renderItem(info)}
        {renderItem && selectOnPress && (<TouchableOpacity onPress={handlePressOnItem} style={styleButton} activeOpacity={activeOpacityButton}>
            {renderItem(info)}
          </TouchableOpacity>)}
      </View>);
        };
    }
    componentDidMount() {
        if (this.props.refFlatList) {
            this.props.refFlatList.current = this.refList.current;
        }
    }
    render() {
        const { horizontal = false, magnet = false, snapInterval = null, snapToAlignment = "center", scrollAnimation = false, flatListComponent, } = this.props;
        const FlatListComponent = flatListComponent || FlatList;
        let snap = {};
        if (snapInterval) {
            snap = {
                snapToInterval: snapInterval,
                snapToAlignment: snapToAlignment,
            };
        }
        return (<FlatListComponent {...this.props} {...snap} onLayout={({ nativeEvent: { layout } }) => {
            this.widthParent = layout.width;
            this.heightParent = layout.height;
        }} onScroll={({ nativeEvent }) => {
            if (this.fingerAction) {
                onSelect(nativeEvent, this.state.selected, this.options, this._handleSelection, this.state.scrollPosition, horizontal);
            }
        }} getItemLayout={(_, index) => {
            let itemLayout;
            if (snapInterval) {
                itemLayout = {
                    length: snapInterval,
                    offset: snapInterval * index,
                    index,
                };
            }
            else {
                itemLayout = {
                    length: this.options[index]
                        ? horizontal
                            ? this.options[index].layout.width
                            : this.options[index].layout.height
                        : 30,
                    offset: this.options[index]
                        ? horizontal
                            ? this.options[index].left
                            : this.options[index].top
                        : 30 * index,
                    index,
                };
            }
            return itemLayout;
        }} onScrollBeginDrag={() => {
            this.onMomentum = true;
            this.fingerAction = true;
        }} onMomentumScrollEnd={() => {
            this.fingerAction = false;
            if (this.onMomentum && magnet && !snapInterval) {
                this.onMomentum = false;
                alignSelect(horizontal, scrollAnimation, this.options[this.state.selected], this.refList);
            }
        }} renderItem={this._renderItem} ref={this.refList}/>);
    }
}
export default SmoothPicker;
