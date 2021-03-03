// type definitions for Cypress object "cy"
/// <reference types="cypress" />

import ReactDOM from "react-dom";
import React from "react";

import {MagicThumbnailWrapper} from "../../src/thumbnail-hider";
import {safeInjectElement} from "../../src/replace-element";

describe("Magic test", function() {
  function disableBrowserExceptions() {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the it
      return false;
    });
  }

  const selectors = {
    thumbnailContainer: "ytd-thumbnail",
    thumbnail: "ytd-thumbnail>a#thumbnail",
    reactThumbnailReplacementContainer: `ytd-thumbnail>div[name="thumbnail-react-container"]`,
  };
  const getElementAtIndex = ({
    selector,
    index,
  }: {
    selector: string;
    index: number;
  }) => cy.get(selector).eq(index);

  const initializeSite = () => {
    cy.visit("./src/__test__/__mocks__/youtube/youtube-snapshot.html");
    cy.get(selectors.thumbnailContainer).should("be.visible");
  };

  it.only("should inject magic script", function() {
    disableBrowserExceptions();
    // cy.visit("./src/__test__/__mocks__/youtube/youtube-snapshot.html");
    cy.visit("http://youtube.com");
    cy.document().then((document) => {
      ReactDOM.render(
        <MagicThumbnailWrapper document={document} />,
        document.querySelectorAll("ytd-rich-item-renderer")[2],
      );
    });
    /* cy.get(selectors.thumbnailContainer).should("not.be.visible"); */
  });
});
