import Vue from "vue";

import "./styles/quasar.styl";
import "@quasar/extras/material-icons/material-icons.css";
import {
  Quasar,
  ClosePopup,
  QLayout,
  QHeader,
  QDrawer,
  QPageContainer,
  QPage,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QCard,
  QCardSection,
  QCardActions,
  QKnob,
  QSelect,
  QTabs,
  QTab,
  QTabPanels,
  QTabPanel,
  QSpace,
  QBtnDropdown,
  QBtnGroup,
  QSlider,
  QBadge,
  QToggle
} from "quasar";

Vue.use(Quasar, {
  config: {},
  components: {
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QCard,
    QCardSection,
    QCardActions,
    QKnob,
    QSelect,
    QTabs,
    QTab,
    QTabPanels,
    QTabPanel,
    QSpace,
    QBtnDropdown,
    QBtnGroup,
    QSlider,
    QBadge,
    QToggle
  },
  directives: {
    ClosePopup
  },
  plugins: {}
});
