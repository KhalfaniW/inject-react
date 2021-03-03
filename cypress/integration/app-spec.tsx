// type definitions for Cypress object "cy"
/// <reference types="cypress" />

import {
  safeInjectElement,
  showReactElement,
  showOriginalElement,
} from "../../src/replace-element";

const thumbnailReplacementText = "Smoke Weed Everyday";
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

  it.only("replace second thumbnail", function() {
    disableBrowserExceptions();
    initializeSite();

    const findThumbnail = () =>
      getElementAtIndex({selector: selectors.thumbnail, index: 1});
    const findContainer = () =>
      getElementAtIndex({
        selector: selectors.thumbnailContainer,
        index: 1,
      });

    const findReactComponent = () =>
      getElementAtIndex({
        selector: selectors.reactThumbnailReplacementContainer,
        index: 0,
      }).children();

    findThumbnail().should("be.visible");

    let thumbnailPair;
    cy.document().then((document) => {
      thumbnailPair = safeInjectElement({
        currentDocument: document,
        jsx: createThumbnailJSX(thumbnailReplacementText),
      });
      showReactElement({elementPair: thumbnailPair});
      //making assertions here does work
    });
    cy.wait(100);
    findContainer().should("contain", thumbnailReplacementText);
    findThumbnail().should("not.be.visible");
    findReactComponent().should("be.visible");

    cy.document().then((document) => {
      showOriginalElement({elementPair: thumbnailPair});
    });
    cy.wait(100);

    findThumbnail().should("be.visible");
    findReactComponent().should("not.be.visible");
  });

  it("should inject script", function() {
    disableBrowserExceptions();
    // cy.visit("./src/__test__/__mocks__/youtube/youtube-snapshot.html");
    cy.visit("http://youtube.com");
    cy.get(selectors.thumbnailContainer, {timeout: 10000}).should("be.visible");
    cy.get(selectors.thumbnail, {timeout: 10000}).should("be.visible");
    cy.document().then((document) => {
      safeInjectElement({
        currentDocument: document,
        jsx: createThumbnailJSX(thumbnailReplacementText),
      });
      //TODO assert that invisible
    });
  });
  it("be shown than be invisible", function() {
    disableBrowserExceptions();
    // cy.visit("./src/__test__/__mocks__/youtube/youtube-snapshot.html");
    cy.visit("http://youtube.com");
    cy.get("ytd-thumbnail", {timeout: 10000}).should("be.visible");
    cy.get("a#thumbnail", {timeout: 10000}).should("be.visible");
    cy.document().then((document) => {
      // work with document element

      cy.log("start");
      // const window = doc.defaultView;
      // window?.stop();
      const thumbnailContainer = document.getElementsByTagName(
        "ytd-thumbnail",
      )[1];
      expect(thumbnailContainer).to.not.be.undefined();

      cy.log("NOT UNDEFINED");
      const originalThumbnail = thumbnailContainer.querySelector("#thumbnail");
      cy.log("stop loading ");
      safeInjectElement(document);
    });
  });
});
