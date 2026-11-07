#include "ObjectFinderPopup.hpp"
#include <algorithm>
#include <charconv>
#include <Geode/binding/LevelEditorLayer.hpp>
#include <Geode/binding/GameObject.hpp>
#include <Geode/binding/ButtonSprite.hpp>
#include <utils/Editor.hpp>

bool ObjectFinderPopup::init(EditorUI* ui) {
    if (!Popup::init(300, 180)) {
        return false;
    }

    m_ui = ui;
    this->setTitle("Object Finder");

    m_resultsLabel = CCLabelBMFont::create("Enter an Object ID or Group ID", "bigFont.fnt");
    m_resultsLabel->setScale(.4f);
    m_mainLayer->addChildAtPosition(m_resultsLabel, Anchor::Center, ccp(0, 15));

    m_search = TextInput::create(220.f, "Object ID or Group ID");
    m_search->setCommonFilter(CommonFilter::Uint);
    m_search->setCallback([this](std::string const& query) {
        this->updateResults(query);
    });
    m_mainLayer->addChildAtPosition(m_search, Anchor::Bottom, ccp(0, 45));

    auto buttonSprite = ButtonSprite::create("Select Objects", "goldFont.fnt", "GJ_button_01.png", .8f);
    buttonSprite->setScale(.7f);
    m_selectButton = CCMenuItemSpriteExtra::create(
        buttonSprite, this, menu_selector(ObjectFinderPopup::onSelect)
    );
    m_selectButton->setEnabled(false);
    m_buttonMenu->addChildAtPosition(m_selectButton, Anchor::Bottom, ccp(0, 15));

    m_results = CCArray::create();
    return true;
}

void ObjectFinderPopup::updateResults(std::string const& query) {
    auto results = CCArray::create();

    if (!query.empty()) {
        int searchID = 0;
        const auto [end, error] = std::from_chars(
            query.data(), query.data() + query.size(), searchID
        );
        if (error != std::errc{} || end != query.data() + query.size()) {
            m_results = results;
            m_selectButton->setEnabled(false);
            m_resultsLabel->setString("Invalid ID");
            return;
        }

        auto allObjects = m_ui->m_editorLayer->getAllObjects();

        if (allObjects) {
            for (auto object : CCArrayExt<GameObject*>(allObjects)) {
                if (!object) {
                    continue;
                }

                bool matches = object->m_objectID == searchID;
                if (!matches && object->m_groups) {
                    const int groupCount = std::clamp(static_cast<int>(object->m_groupCount), 0, 10);
                    for (int i = 0; i < groupCount; ++i) {
                        if ((*object->m_groups)[i] == searchID) {
                            matches = true;
                            break;
                        }
                    }
                }

                if (matches) {
                    results->addObject(object);
                }
            }
        }
    }

    m_results = results;
    m_selectButton->setEnabled(results->count() > 0);

    if (query.empty()) {
        m_resultsLabel->setString("Enter an Object ID or Group ID");
    }
    else {
        auto label = std::to_string(results->count()) + " object(s) found";
        m_resultsLabel->setString(label.c_str());
    }
}

void ObjectFinderPopup::onSelect(CCObject*) {
    if (!m_ui || !m_results || m_results->count() == 0) {
        return;
    }

    auto ui = m_ui;
    auto results = m_results;
    ui->selectObjects(results, true);
    be::focusEditorOnObjects(ui, results, true);
    ui->updateButtons();
    this->onClose(nullptr);
}

ObjectFinderPopup* ObjectFinderPopup::create(EditorUI* ui) {
    auto ret = new ObjectFinderPopup();
    if (ret && ret->init(ui)) {
        ret->autorelease();
        return ret;
    }
    CC_SAFE_DELETE(ret);
    return nullptr;
}
