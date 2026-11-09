#include <Geode/Geode.hpp>
#include "multiplayer/SessionManager.hpp"
#include "multiplayer/ui/settings/AppearanceSetting.hpp"

using namespace geode::prelude;

$on_mod(Loaded) {
    log::info("Alt3rEdit with Multiplayer loaded!");

    (void)Mod::get()->registerCustomSettingType(
        "appearance",
        &mpedit::AppearanceSettingV3::parse
    );
}

$on_mod(DataSaved) {
    auto& session = mpedit::SessionManager::get();
    if (session.isInSession()) {
        session.leaveSession();
    }
}
