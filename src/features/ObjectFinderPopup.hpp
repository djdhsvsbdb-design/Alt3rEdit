#pragma once

#include <Geode/ui/Popup.hpp>
#include <Geode/ui/TextInput.hpp>

using namespace geode::prelude;

class ObjectFinderPopup : public Popup {
protected:
    EditorUI* m_ui;
    TextInput* m_search;
    CCLabelBMFont* m_resultsLabel;
    CCMenuItemSpriteExtra* m_selectButton;
    Ref<CCArray> m_results;

    bool init(EditorUI* ui);
    void updateResults(std::string const& query);
    void onSelect(CCObject*);

public:
    static ObjectFinderPopup* create(EditorUI* ui);
};
