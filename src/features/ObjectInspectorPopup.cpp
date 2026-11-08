#include "ObjectInspectorPopup.hpp"
#include <algorithm>
#include <set>
#include <sstream>
#include <Geode/binding/GameObject.hpp>
#include <utils/Editor.hpp>

bool ObjectInspectorPopup::init(EditorUI* ui) {
    if (!Popup::init(300, 220)) {
        return false;
    }

    m_ui = ui;
    this->setTitle("Object Inspector");

    if (!m_ui) {
        auto label = CCLabelBMFont::create("Editor unavailable", "bigFont.fnt");
        label->setScale(.45f);
        m_mainLayer->addChildAtPosition(label, Anchor::Center);
        return true;
    }

    auto selected = be::getSelectedObjects(m_ui);
    std::set<int> objectIDs;
    std::set<int> groupIDs;

    for (auto object : selected) {
        if (!object) {
            continue;
        }

        objectIDs.insert(object->m_objectID);
        if (object->m_groups) {
            const int count = std::clamp(static_cast<int>(object->m_groupCount), 0, 10);
            for (int i = 0; i < count; ++i) {
                const int groupID = (*object->m_groups)[i];
                if (groupID > 0) {
                    groupIDs.insert(groupID);
                }
            }
        }
    }

    std::ostringstream details;
    details << "Selected objects: " << selected.size() << "\n";
    details << "Unique object IDs: " << objectIDs.size() << "\n";
    details << "Unique groups: " << groupIDs.size() << "\n\n";

    details << "Object IDs: ";
    if (objectIDs.empty()) {
        details << "none";
    }
    else {
        bool first = true;
        for (int id : objectIDs) {
            if (!first) details << ", ";
            details << id;
            first = false;
        }
    }

    details << "\nGroups: ";
    if (groupIDs.empty()) {
        details << "none";
    }
    else {
        bool first = true;
        for (int id : groupIDs) {
            if (!first) details << ", ";
            details << id;
            first = false;
        }
    }

    auto label = CCLabelBMFont::create(details.str().c_str(), "bigFont.fnt");
    label->setAnchorPoint(ccp(.5f, .5f));
    label->setScale(.38f);
    label->setWidth(690.f);
    m_mainLayer->addChildAtPosition(label, Anchor::Center, ccp(0, -5));

    return true;
}

ObjectInspectorPopup* ObjectInspectorPopup::create(EditorUI* ui) {
    auto ret = new ObjectInspectorPopup();
    if (ret && ret->init(ui)) {
        ret->autorelease();
        return ret;
    }
    CC_SAFE_DELETE(ret);
    return nullptr;
}
