import {ReactElement} from "react";

import {RenderFunction} from "./";

export type HTMLElementReplacementPair = {
  originalElementToReplace: HTMLElement;
  reactComponentContainer: HTMLElement;
};
export enum ElementShown {
  React = "React",
  Original = "Original",
}

const reactContainerSelector = "div[name=react-container]";
const containerName = "react-container";
export function injectElement({
  //safe injecting will not inject twice
  siblingElementToReplace,
  jsx,
  currentDocument,
  ReactDomRenderFunction,
}: {
  //TODO fix any
  siblingElementToReplace: HTMLElement;
  currentDocument: Document;
  jsx: ReactElement;
  index: number;
  ReactDomRenderFunction: RenderFunction;
}): HTMLElementReplacementPair {
  const reactThumbnailParent = buildReactComponentContainer({
    originalElementContainer: siblingElementToReplace.parentElement!,
    currentDocument,
    jsx: jsx,
    ReactDomRenderFunction,
  });
  const thumbnailReplacementPair: HTMLElementReplacementPair = {
    originalElementToReplace: siblingElementToReplace,
    reactComponentContainer: reactThumbnailParent!,
  };
  /* showReactElement({elementPair: thumbnailReplacementPair}); */

  return thumbnailReplacementPair;
}

export function buildReactComponentContainer({
  originalElementContainer,
  currentDocument,
  jsx,
  ReactDomRenderFunction,
}: {
  originalElementContainer: HTMLElement;
  currentDocument: Document;
  jsx: ReactElement;
  ReactDomRenderFunction: RenderFunction;
}): HTMLElement {
  const reactContainer = createReactContainer({
    currentDocument,
  });
  originalElementContainer.appendChild(reactContainer);
  ReactDomRenderFunction(jsx, reactContainer);
  return reactContainer;
}

export function getReactContainer(elementContainer: HTMLElement) {
  return elementContainer.querySelectorAll(
    reactContainerSelector,
  )[0] as HTMLElement;
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
