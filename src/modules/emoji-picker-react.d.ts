declare module "emoji-picker-react" {
    interface EmojiPickerProps {
        onEmojiClick?: PropTypes.func.isRequired;
        assetPath?: PropTypes.string;
        emojiResolution?: PropTypes.number;
        preload?: PropTypes.bool;
        customCategoryNames?: PropTypes.object;
        disableDiversityPicker?: PropTypes.bool;
    }
    class EmojiPicker extends React.Component<EmojiPickerProps, any> {}
    export default EmojiPicker;
}