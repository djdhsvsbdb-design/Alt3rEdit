#include <Geode/modify/EditorUI.hpp>
#include <Geode/utils/general.hpp>
#include <Geode/ui/Notification.hpp>
#include <Geode/binding/GameManager.hpp>

using namespace geode::prelude;

static bool isProbablyObjectString(std::string_view str) {
    // check if it starts with [0-9]+,
    size_t ix = 0;
    for (auto c : str) {
        if (!(c == ',' && ix > 0) && !(c >= '0' && c <= '9')) {
            return false;
        }
        if (c == ',' && ix > 0) {
            return true;
        }
        ix += 1;
    }
    return false;
}

class $modify(EditorUI) {
    // Hook these instead of copyObjects and pasteObjects so something like 
    // onDuplicate doesn't get overwritten
    void doCopyObjects(bool idk) {
        EditorUI::doCopyObjects(idk);
        if (Mod::get()->template getSettingValue<bool>("copy-paste-from-clipboard")) {
            clipboard::write(GameManager::get()->m_editorClipboard);
        }
    }
    void doPasteObjects(bool idk) {
        if (!Mod::get()->template getSettingValue<bool>("copy-paste-from-clipboard")) {
            return EditorUI::doPasteObjects(idk);
        }

        // Read once so validation and pasting always use the same clipboard contents.
        auto clipboardContent = clipboard::read();
        if (isProbablyObjectString(clipboardContent)) {
            GameManager::get()->m_editorClipboard = clipboardContent;
            EditorUI::doPasteObjects(idk);
            Notification::create("Pasted Objects from Clipboard", NotificationIcon::Info)->show();
            return;
        }

        EditorUI::doPasteObjects(idk);
    }
};
