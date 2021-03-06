import {
  ElementShown,
  getElementShown,
  getIsOriginalElementHidden,
  getReactContainer,
  hideOriginalElement,
  injectElement,
  showOriginalElement,
  showReactElement,
} from "./replace-element";
import {Renderer} from "react-dom";
export {
  ElementShown,
  getElementShown,
  getIsOriginalElementHidden,
  hideOriginalElement,
  injectElement,
  getReactContainer,
  showOriginalElement,
  showReactElement,
};
export type HTMLElementReplacementPair = {
  originalElementToReplace: HTMLElement;
  reactComponentContainer: HTMLElement;
};
export type RenderFunction = Renderer;

//NOTES
// + use only parent so it does not go in recursivly
// + inject into nonRecursiveChilden children nodes to avoid recursive search and injecting into an existing react component
// + use a convuluated element selector paramaters protect against recursive cases
// + dont store the config in a variable it may be in sync with the DOM references
export function injectReactInto({
  immediateParentNode,
  nonRecursiveChildFilterFunction,
  previousElementPairs = [],
  renderAtIndex,
  //Having ReactDOM.render as a depenncy will break with different react versions
  ReactDomRenderFunction,
}: {
  immediateParentNode: HTMLElement;
  nonRecursiveChildFilterFunction: (el: HTMLElement) => boolean;
  previousElementPairs: Array<HTMLElementReplacementPair>;
  renderAtIndex: (index: number) => JSX.Element;
  ReactDomRenderFunction: RenderFunction;
}) {
  const previousOriginalElements = previousElementPairs.map(
    (pair) => pair.originalElementToReplace,
  );

  const currentDocument = immediateParentNode.ownerDocument;
  const filterChildren = (element: Element) =>
    nonRecursiveChildFilterFunction(element as HTMLElement);
  const getIsNotInPreviousElementPairs = (element: Element) =>
    !previousOriginalElements.includes(element as HTMLElement);

  return Array.from(immediateParentNode.children)
    .filter(getIsNotInPreviousElementPairs)
    .filter(filterChildren)
    .filter(getIsSafeToInjectInto)
    .map((element, index) => {
      const offSet = previousElementPairs.length;
      const newIndex = offSet + index;
      /* console.log({newIndex, render: renderAtIndex(newIndex)}); */

      const elementPair = injectElement({
        siblingElementToReplace: element as HTMLElement,
        currentDocument: currentDocument,
        jsx: renderAtIndex(newIndex),
        index: newIndex,
        ReactDomRenderFunction,
      });
      return elementPair;
    });
}

function getIsSafeToInjectInto(element: Element) {
  // only need to check if is react element because of strict selction process
  return element.getAttribute("name") !== "react-container";
}
