import { NativeScrollEvent } from 'react-native';
import { Option, HandleSelection } from '../SmoothPicker';
export default function (nativeEvent: NativeScrollEvent, selected: number, options: Option[], handleSelection: HandleSelection, scrollPosition: number | null, horizontal: boolean | null): void;
