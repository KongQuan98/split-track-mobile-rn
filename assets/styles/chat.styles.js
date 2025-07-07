import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/color";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  chatStatus: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  messageBubbleSent: {
    backgroundColor: COLORS.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  messageBubbleReceived: {
    backgroundColor: COLORS.white,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextSent: {
    color: COLORS.white,
  },
  messageTextReceived: {
    color: COLORS.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  messageTimeSent: {
    color: COLORS.white,
    textAlign: "right",
  },
  messageTimeReceived: {
    color: COLORS.textLight,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  typingIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 15,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textLight,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  systemMessage: {
    alignItems: "center",
    marginVertical: 10,
  },
  systemMessageText: {
    fontSize: 12,
    color: COLORS.textLight,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.income,
    marginLeft: 6,
  },
  offlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
    marginLeft: 6,
  },
  groupIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primary + "20",
    marginLeft: 8,
  },
  groupIndicatorText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "500",
  },
}); 