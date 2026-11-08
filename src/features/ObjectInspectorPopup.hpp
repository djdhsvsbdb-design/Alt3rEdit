#pragma once

#include <Geode/ui/Popup.hpp>

using namespace geode::prelude;

class ObjectInspectorPopup : public Popup {
protected:
    EditorUI* m_ui = nullptr;

    bool init(EditorUI* ui);

public:
    static ObjectInspectorPopup* create(EditorUI* ui);
};
