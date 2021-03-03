import {ReactElement} from "react";
import ReactDOM from "react-dom";
import DOMSelectors from "./tools/youtube-element-selectors";

export interface HTMLElementReplacementPair {
  originalElementToReplace: HTMLElement;
  reactComponentContainer: HTMLElement;
}
export enum ElementShown {
  React = "React",
  Original = "Original",
}

const reactContainerSelector = "div[name=react-container]";
const containerName = "react-container";
export function safeInjectElement({
  //safe injecting will not inject twice
  currentDocument,
  jsx,
  index,
}: {
  currentDocument: Document;
  jsx: ReactElement;
  index: number;
}): HTMLElementReplacementPair {
  const {
    thumbnailContainer,
    originalThumbnail,
  } = getThumbnailAndThumbnailContainer({
    currentDocument,
    thumbnailIndex: index,
  });

  const reactThumbnailParent = buildReactComponentContainer({
    originalElementContainer: thumbnailContainer,
    currentDocument,
    jsx: jsx,
  });
  const thumbnailReplacementPair: HTMLElementReplacementPair = {
    originalElementToReplace: originalThumbnail!,
    reactComponentContainer: reactThumbnailParent!,
  };
  /* showReactElement({elementPair: thumbnailReplacementPair}); */

  return thumbnailReplacementPair;
}

export function buildReactComponentContainer({
  originalElementContainer,
  currentDocument,
  jsx,
}: {
  originalElementContainer: HTMLElement;
  currentDocument: Document;
  jsx: ReactElement;
}): HTMLElement {
  const isContainerAlreadyPresent = getIsReactContainerPresentIn(
    originalElementContainer,
  );
  if (isContainerAlreadyPresent) {
    return getReactContainer(originalElementContainer);
  }
  const reactContainer = createReactContainer({
    currentDocument,
  });
  originalElementContainer.appendChild(reactContainer);
  ReactDOM.render(jsx, reactContainer);
  return reactContainer;
}
function getIsReactContainerPresentIn(elementContainer: HTMLElement) {
  return elementContainer.querySelectorAll(reactContainerSelector).length > 0;
}

function getReactContainer(elementContainer: HTMLElement) {
  return elementContainer.querySelectorAll(reactContainerSelector)[0];
}

export function getIsOriginalElementHidden({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}): Boolean {
  const isOriginalShown =
    elementPair.originalElementToReplace.style.visibility === "hidden";
  return isOriginalShown;
}

export function getElementShown({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}): ElementShown {
  const isOriginalHidden =
    elementPair.originalElementToReplace.style.visibility === "hidden";
  const isReactHidden =
    elementPair.originalElementToReplace.style.visibility === "react";

  if (isReactHidden && isOriginalHidden) {
    throw Error("Both react and originial elements are hidden");
  }
  if (!isReactHidden && !isOriginalHidden) {
    throw Error("Both react and originial elements are visibile");
  }

  if (isOriginalHidden) {
    return ElementShown.React;
  }

  return ElementShown.Original;
}
export function getThumbnailAndThumbnailContainer({
  currentDocument,
  thumbnailIndex,
}: {
  currentDocument: Document;
  thumbnailIndex: number;
}) {
  const thumbnailContainer = DOMSelectors.getAllThumbnails(currentDocument)[
    thumbnailIndex
  ] as HTMLElement;
  const originalThumbnail = thumbnailContainer.querySelector<HTMLElement>(
    "#thumbnail",
  );
  return {
    thumbnailContainer,
    originalThumbnail,
  };
}
export function getReactComponent({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}) {
  const reactElementParentWithOneReactChild =
    elementPair.reactComponentContainer;
  return reactElementParentWithOneReactChild.children[0];
}

function createReactContainer({currentDocument}: {currentDocument: Document}) {
  const thumbnailReactContainer = currentDocument.createElement("div");
  thumbnailReactContainer.setAttribute("name", containerName);
  return thumbnailReactContainer;
}

export function showReactElement({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}) {
  elementPair.originalElementToReplace.style.visibility = "hidden";
}
export function hideOriginalElement({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}) {
  elementPair.originalElementToReplace.style.visibility = "hidden";
}

export function showOriginalElement({
  elementPair,
}: {
  elementPair: HTMLElementReplacementPair;
}) {
  elementPair.originalElementToReplace.style.visibility = "";
}
