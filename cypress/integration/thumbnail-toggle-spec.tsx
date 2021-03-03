// type definitions for Cypress object "cy"
/// <reference types="cypress" />

import React from "react";

import {ActionNames} from "../../src/thumbnail-hider";
import {initializeStoreIntoDOM} from "../../src";
import {safeInjectElement, showOriginalElement} from "../../src/replace-element";
import DOMSelectors from "../../src/tools/youtube-element-selectors";
const thumbnailReplacementText = "Smoke Weed Everyday";
const selectors = {
  thumbnailContainer: DOMSelectors.thumbnailContainer,
  thumbnail: DOMSelectors.thumbnail,
  reactThumbnailReplacementContainer:
    DOMSelectors.reactThumbnailReplacementContainer,
};
const getElementAtIndex = ({
  selector,
  index,
}: {
  selector: string;
  index: number;
}) => cy.get(selector).eq(index);

const userActions = {
  showThumbnailAtIndex: (index: number) => {
    const showThumbnailButton = getElementAtIndex({
      selector: selectors.reactThumbnailReplacementContainer,
      index: index,
    }).contains(ActionNames.showThumbnailButtonText);

    showThumbnailButton.click();
  },
  hideThumbnailAtIndex: (index: number) => {
    const hideThumbnailButton = getElementAtIndex({
      selector: selectors.reactThumbnailReplacementContainer,
      index: index,
    }).contains(ActionNames.hideThumbnailButtonText);

    hideThumbnailButton.click();
  },
};

export const createThumbnailJSX = (thumbnailReplacementText: string) => (
  <React.StrictMode>
    <button
      style={{position: "absolute", top: 0, left: 0}}
      onClick={() => {
        alert("pleasentness");
      }}
    >
      {thumbnailReplacementText}
    </button>
  </React.StrictMode>
);

describe("App", function() {
  function disableBrowserExceptions() {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the it
      return false;
    });
  }

  const initializeSite = () => {
    cy.visit("./src/__test__/__mocks__/youtube/youtube-snapshot.html");
    cy.get(selectors.thumbnailContainer).should("be.visible");
  };

  it.only("replace thumbnails with clickable react components", function() {
    disableBrowserExceptions();
    initializeSite();
    let thumbnailPair;
    cy.document().then((document) => {
      initializeStoreIntoDOM({currentDocument: document});
    });
  });
});
