import {Provider} from "react-redux";
import React from "react";

import {ThumbnailHider} from "./thumbnail-hider";
import store from "./redux/modules/store";
import {HTMLElementReplacementPair} from "./replace-element";
import {
  ElementShown,
  getElementShown,
  getIsOriginalElementHidden,
  hideOriginalElement,
  safeInjectElement,
  showOriginalElement,
} from "../../replace-element";

type Store = any;

interface InjectorCreatorSettings {
  querySelectorString: string;
  renderAtIndex: (index: number) => JSX.Element;
  currentDocument: Document;
}
export function injectReactIntoOne({
  querySelector,
  render,
  currentDocument,
}: InjectorCreatorSettings) {
  return injectReactInto({
    nodeGroupToInjectInto: [
      currentDocument.querySelectorAll(querySelectorString)[0],
    ],
    renderAtIndex: (index: number) => render(),
  });
}

export function injectReactIntoAllMatches({
  querySelectorString,
  renderAtIndex,
  currentDocument,
}: InjectorCreatorSettings) {
  return injectReactInto({
    nodeGroupToInjectInto: currentDocument.querySelectorAll(
      querySelectorString,
    ),
    renderAtIndex,
  });
}
export function injectReactInto({
  nodeGroupToInjectInto,
  renderAtIndex,
}: InjectorCreatorSettings) {
  let elementPairs: Array<HTMLElementReplacementPair> = [];
  nodeGroupToInjectInto.forEach((element, thumbnailIndex) => {
    const elementPair = safeInjectElement({
      currentDocument: currentDocument,
      jsx: renderAtIndex(thumbnailIndex),
      index: thumbnailIndex,
    });
    elementPairs.push(elementPair);
  });
  return elementPairs;
}

function hideOnTimer() {}
function deleteReplaceElementOnce() {}
function deleteReplaceElementLoop() {}

function hideReplaceElementOnce() {}
function hideReplaceElementLoop() {}
